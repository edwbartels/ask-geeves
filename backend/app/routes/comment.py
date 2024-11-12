from flask import Blueprint, jsonify, request
from flask_login import current_user
from sqlalchemy import asc, desc  # noqa
from ..models.answer import Answer
from ..models.comment import Comment
from ..models.db import db
from ..utils.errors import ValidationError,ExistenceError,AuthorizationError
from ..utils.decorator import (
    login_check,
    collect_query_params,
    existence_check
)

bp = Blueprint("comment", __name__, url_prefix="/api/comments")


@bp.route("/question/<int:question_id>", methods=["GET"])
@existence_check(("Question", "question_id"))
@collect_query_params(Comment)
def get_all_comments_for_question(
    question_id, question, page, per_page, sort_column, sort_order
):
    comments = (
        Comment.query.filter_by(content_id=question_id, content_type="question")
        .order_by(sort_order(sort_column))
        .paginate(page=page, per_page=per_page)
    )

    comments_list = [comment.to_dict() for comment in comments]
    return jsonify(
        {
            "page": page,
            "size": len(comments.items),
            "total_pages": comments.pages,
            "comments": comments_list,
        }
    ), 200


@bp.route("/answer/<int:answer_id>", methods=["GET"])
@existence_check(("Answer", "answer_id"))
@collect_query_params(Comment)
def get_all_comments_for_an_answer(
    answer_id, answer, page, per_page, sort_column, sort_order
):
    comments = (
        Comment.query.filter_by(content_id=answer_id, content_type="answer")
        .order_by(sort_order(sort_column))
        .paginate(page=page, per_page=per_page)
    )
    comments_list = [comment.to_dict() for comment in comments]
    return jsonify(
        {
            "page": page,
            "size": len(comments.items),
            "total_pages": comments.pages,
            "comments": comments_list,
        }
    ), 200


@bp.route("/question/<int:question_id>/allcomments", methods=["GET"])
@existence_check(("Question", "question_id"))
def get_all_comments(question_id, question):
    comments_list = []

    question_comments = Comment.query.filter_by(
        content_id=question_id, content_type="question"
    ).all()
    for comment in question_comments:
        comments_list.append(comment.to_dict())

    answer_comments = []
    answer_ids = [
        answer.id for answer in Answer.query.filter_by(question_id=question_id).all()
    ]
    for id in answer_ids:
        comments = Comment.query.filter_by(content_id=id, content_type="answer").all()
        answer_comments.extend(comments)

    for comment in answer_comments:
        comments_list.append(comment.to_dict())

    return jsonify({"comments": comments_list}), 200


@bp.route("/<int:comment_id>", methods=["POST","PUT","DELETE"])
@login_check
def create_comment(comment_id):
    if request.method == "POST" and comment_id==0:
        data = request.get_json()
        content = data.get("content")
        content_type = data.get("content_type")
        content_id = data.get("content_id")
        errors = []
        if not content:
            errors.append(("Content", "Data is required"))
        if errors:
            raise ValidationError(errors=errors)

        new_comment = Comment(
            user_id=current_user.id,
            content=content,
            content_id=content_id,
            content_type=content_type,
        )
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({"comment": new_comment.to_dict()}), 201
    
    elif request.method == "PUT":
        target_comment = Comment.query.get(comment_id)
        if not target_comment:
            raise ExistenceError(errors=[("Comment", "comment not found")])
        if target_comment.user_id != current_user.id:
            raise AuthorizationError("comment")
        data = request.get_json()
        content = data.get("content")
        errors = []
        if not content:
            errors.append(("Content", "Data is required"))
        if errors:
            raise ValidationError(errors=errors)
        target_comment.content = content
        db.session.commit()
        return jsonify({"comment": target_comment.to_dict()}), 200

    elif request.method == "DELETE":
        target_comment = Comment.query.get(comment_id)
        if not target_comment:
            raise ExistenceError(errors=[("Comment", "comment not found")])
        if target_comment.user_id != current_user.id:
            raise AuthorizationError("comment")
        db.session.delete(target_comment)
        db.session.commit()
        return jsonify({"message": "comment deleted"}), 200
