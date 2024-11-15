from flask import Blueprint, jsonify, request
from flask_login import current_user
from sqlalchemy import func, asc, desc  # noqa
from ..models.question import Question
from ..models.tag import Tag
from ..models.db import db
from ..utils.decorator import (
    login_check,
    collect_query_params,
    existence_check,
    authorization_check,
    owner_check,
)
from ..utils.errors import ValidationError
# from sqlalchemy.orm import noload, lazyload, load_only

bp = Blueprint("question", __name__, url_prefix="/api/questions")


@bp.route("/", methods=["GET"])
@collect_query_params(Question)
def get_all_questions(page, per_page, sort_column, sort_order):
  
    filter_tag = request.args.get("tag")
    following_feed = request.args.get("follow") == "1"

    query = Question.query
    if filter_tag:
        filter_tag = filter_tag.replace("-", " ")
        query = query.filter(Question.tags.any(Tag.name.ilike(filter_tag)))
    if following_feed:
        query = query.filter(
            Question.user_id.in_([user.id for user in current_user.following])
        )


    questions = query.order_by(sort_order(sort_column)).paginate(
        page=page, per_page=per_page
    )

    questions_list = [question.to_dict(homepage=True) for question in questions.items]

    return jsonify(
        {
            "page": page,
            "size": len(questions.items),
            "num_pages": questions.pages,
            "questions": questions_list,
        }
    ), 200

@bp.route("/<int:question_id>", methods=["GET"])
@existence_check(("Question", "question_id"))
def get_question_by_id(question_id, question):
    question = Question.query.get(question_id)
    return jsonify({"question": question.to_dict(detail_page=True)})


@bp.route("/current", methods=["GET"])
@login_check
@collect_query_params(Question)
def get_questions_by_current_user(page, per_page, sort_column, sort_order):
    questions = (
        Question.query.filter(Question.user_id == current_user.id)
        .order_by(sort_order(sort_column))
        .paginate(page=page, per_page=per_page)
    )

    questions_list = [question.to_dict() for question in questions.items]
    return jsonify(
        {
            "page": page,
            "size": len(questions.items),
            "total_pages": questions.pages,
            "questions_owned": questions_list,
        }
    ), 200


@bp.route("/user/<int:user_id>", methods=["GET"])
@collect_query_params(Question)
def get_questions_by_userId(user_id, page, per_page, sort_column, sort_order):
    questions = (
        Question.query.filter_by(user_id=user_id)
        .order_by(sort_order(sort_column))
        .paginate(page=page, per_page=per_page)
    )

    # paginated_questions = questions.paginate(page=page, per_page=per_page)
    total_pages = questions.pages

    questions_list = [question.to_dict(homepage=True) for question in questions]
    return jsonify(
        {
            "page": page,
            "size": per_page,
            "total_pages": total_pages,
            "questions_owned": questions_list,
        }
    ), 200


@bp.route("/", methods=["POST"])
@login_check
def create_question():
    data = request.get_json()
    content = data.get("content")
    title = data.get("title")
    """
    errors changed from dict to list. Can go back to your original method with
    Error Dict with props for fields rather than field being a prop of
    Individual error dicts within the list. Just wanted to show multiple methods
    """
    errors = []
    if not content:
        errors.append(("content", "Data is required"))
    if not title:
        errors.append(("title", "Data is required"))
    if errors:
        raise ValidationError(errors=errors)

    input_tags = data.get("tag")
    tags = []
    if input_tags:
        for tag_name in input_tags:
            tag_name = tag_name.strip()
            if not tag_name:
                continue
            existing_tag = Tag.query.filter(func.lower(Tag.name) == tag_name.lower()).first()
            if existing_tag:
                tags.append(existing_tag)
            else:
                new_tag = Tag(name=tag_name)
                db.session.add(new_tag)
                tags.append(new_tag)

    new_question = Question(
        user_id=current_user.id, content=content, tags=tags, title=title
    )
    db.session.add(new_question)
    db.session.commit()
    return jsonify({"question": new_question.to_dict(detail_page=True)}), 201


@bp.route("/<int:question_id>", methods=["PUT"])
@login_check
@existence_check(("Question", "question_id"))
@authorization_check(owner_check, "question")
def edit_question(question_id, question):
    data = request.get_json()
    new_content = data.get("content")
    new_title = data.get("title")
    errors = []
    if not new_content:
        errors.append(("content", "Data is required"))
    if not new_title:
        errors.append(("title", "Data is required"))
    if errors:
        raise ValidationError(errors=errors)

    question.content = new_content
    question.title = new_title
    db.session.commit()
    return jsonify({"question": question.to_dict(detail_page=True)}), 200


@bp.route("/<int:question_id>", methods=["DELETE"])
@login_check
@existence_check(("Question", "question_id"))
@authorization_check(owner_check, "question")
def delete_question(question_id, question):
    db.session.delete(question)
    db.session.commit()
    return jsonify({"message": "question deleted"}), 200
