from flask import Blueprint, jsonify, request
from flask_login import current_user
from sqlalchemy import asc, desc
from ..models.question import Question
from ..models.tag import Tag
from ..models.db import db
from ..utils.decorator import (
    login_check,
    question_exist_check,
    question_ownership_check,
    collect_query_params,
)
from sqlalchemy.orm import noload, lazyload, load_only

bp = Blueprint("question", __name__, url_prefix="/api/questions")


@bp.route("/", methods=["GET"])
@collect_query_params(Question)
def get_all_questions(page, per_page, sort_column, sort_order):
    # all_questions = Question.query.options(noload(Question.saves),noload(Question.answers),noload(Question.comments)).all()
    # all_questions = Question.query.options(lazyload(Question.answers)).all()
    # all_questions = Question.query.options(load_only(Question.id, Question.title)).all()

    filter_tag = request.args.get("filter_tag")

    if filter_tag:
        questions = Question.query.filter(Question.tags.any(name=filter_tag))
    else:
        questions = Question.query

    questions = questions.order_by(sort_order(sort_column)).paginate(
        page=page, per_page=per_page
    )

    if not questions.items:
        return jsonify({"message": "No questions found"}), 404
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
def get_question_by_id(question_id):
    question = Question.query.get(question_id)
    if question:
        return jsonify({"question": question.to_dict()})
    else:
        return jsonify({"error": "Question not found"}), 404


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


@bp.route("/", methods=["POST"])
@login_check
def create_question():
    data = request.get_json()
    content = data.get("content")
    title = data.get("title")
    if not content or not title:
        return jsonify({"error": "Both content and title are required"}), 400
    input_tags = data.get("tag")
    tags = []
    if input_tags:
        for tag_name in input_tags:
            tag_name = tag_name.strip()
            if not tag_name:
                continue
            existing_tag = Tag.query.filter_by(name=tag_name).first()
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
    return jsonify({"question": new_question.to_dict()}), 201


@bp.route("/<int:question_id>", methods=["PUT"])
@login_check
@question_exist_check
@question_ownership_check
def edit_question(question_id):
    question = Question.query.get(question_id)
    data = request.get_json()
    new_content = data.get("content")
    new_title = data.get("title")
    if not new_content or not new_title:
        return jsonify({"error": "Both content and title is required"}), 400
    question.content = new_content
    question.title = new_title
    db.session.commit()
    return jsonify({"question": question.to_dict()}), 200


@bp.route("/<int:question_id>", methods=["DELETE"])
@login_check
@question_exist_check
@question_ownership_check
def delete_question(question_id):
    question = Question.query.get(question_id)
    db.session.delete(question)
    db.session.commit()
    return jsonify({"message": "question deleted"}), 200
