from flask import Blueprint, jsonify, request
from flask_login import current_user
from sqlalchemy import asc, desc
from ..models.answer import Answer
from ..models.db import db
from ..utils.decorator import (
    login_check,
    question_exist_check,
    question_ownership_check,
    answer_exist_check,
    answer_ownership_check,
)

bp = Blueprint("answer", __name__, url_prefix="/api/questions")

SORT_BY_MAP = {
    "created_at": Answer.created_at,
    "updated_at": Answer.updated_at,
    "total_score": Answer.total_score,
}

SORT_ORDER_MAP = {"asc": asc, "desc": desc}


@bp.route("/<int:question_id>/answers", methods=["GET"])
def get_all_answers_by_questionId(question_id):
    page, per_page, sort_by, order = (
        request.args.get(key, default, type=typ)
        for key, default, typ in [
            ("page", 1, int),
            ("per_page", 15, int),
            ("sort_by", "created_at", str),
            ("order", "desc", str),
        ]
    )
    sort_column = SORT_BY_MAP.get(sort_by, Answer.created_at)
    sort_order = SORT_ORDER_MAP.get(order, desc)

    answers = (
        Answer.query.filter_by(question_id=question_id)
        .order_by(sort_order(sort_column))
        .paginate(page=page, per_page=per_page)
    )
    total_pages = answers.pages
    answers_list = [answer.to_dict() for answer in answers]
    return jsonify(
        {
            "page": page,
            "size": per_page,
            "total_pages": total_pages,
            "answers": answers_list,
        }
    ), 200


@bp.route("/all/answers/current", methods=["GET"])
@login_check
def get_all_answers_by_current_user():
    page, per_page, sort_by, order = (
        request.args.get(key, default, type=typ)
        for key, default, typ in [
            ("page", 1, int),
            ("per_page", 15, int),
            ("sort_by", "created_at", str),
            ("order", "desc", str),
        ]
    )
    sort_column = SORT_BY_MAP.get(sort_by, Answer.created_at)
    sort_order = SORT_ORDER_MAP.get(order, desc)

    answers = (
        Answer.query.filter_by(user_id=current_user.id)
        .order_by(sort_order(sort_column))
        .paginate(page=page, per_page=per_page)
    )
    total_pages = answers.pages
    answers_list = [answer.to_dict() for answer in answers]
    return jsonify(
        {
            "page": page,
            "size": per_page,
            "total_pages": total_pages,
            "answers": answers_list,
        }
    ), 200


@bp.route("/<int:question_id>/answers/current", methods=["GET"])
@question_exist_check
def get_all_answers_by_questionId_and_currentUser(question_id):
    answers = Answer.query.filter_by(
        question_id=question_id, user_id=current_user.id
    ).all()
    answers_list = [answer.to_dict() for answer in answers]
    return jsonify({"answers": answers_list}), 200


@bp.route("/<int:question_id>/answers", methods=["POST"])
@login_check
@question_exist_check
def create_answer_by_questionId(question_id):
    data = request.get_json()
    new_content = data.get("content")
    if not new_content:
        return jsonify({"error": "Content is required"}), 400
    new_answer = Answer(
        user_id=current_user.id,
        question_id=question_id,
        content=data["content"],
    )
    db.session.add(new_answer)
    db.session.commit()
    return jsonify({"answer": new_answer.to_dict()}), 201


@bp.route("/<int:question_id>/answers/<int:answer_id>", methods=["PUT"])
@login_check
@answer_exist_check
@answer_ownership_check
def edit_answer_by_questionId_and_answerId(question_id, answer_id):
    answer = Answer.query.get(answer_id)
    data = request.get_json()
    new_content = data.get("content")
    if not new_content:
        return jsonify({"error": "Content is required"}), 400
    answer.content = new_content
    db.session.commit()
    return jsonify({"answer": answer.to_dict()}), 200


@bp.route("/<int:question_id>/answers/<int:answer_id>", methods=["DELETE"])
@login_check
@answer_exist_check
@answer_ownership_check
def delete_answer_by_questionId_and_answerId(question_id, answer_id):
    answer = Answer.query.get(answer_id)
    db.session.delete(answer)
    db.session.commit()
    return jsonify({"message": "answer deleted"})


@bp.route("/<int:question_id>/answers/<int:answer_id>/accept", methods=["PUT"])
@login_check
@question_exist_check
@question_ownership_check
def mark_answer_accepted_by_questionId_and_answerId(question_id, answer_id):
    answer = Answer.query.get(answer_id)
    if not answer:
        return jsonify({"error": "Answer not found"}), 404
    answer.accepted = not answer.accepted
    db.session.commit()
    return jsonify({"answer": answer.to_dict()}), 200
