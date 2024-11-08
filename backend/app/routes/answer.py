from flask import Blueprint, jsonify, request
from flask_login import current_user
from sqlalchemy import asc, desc  # noqa
from ..models.answer import Answer
from ..models.db import db
from ..utils.decorator import (
    csrf_protect,
    login_check,
    question_exist_check,
    question_ownership_check,
    answer_exist_check,
    answer_ownership_check,
    collect_query_params,
)

bp = Blueprint("answer", __name__, url_prefix="/api/questions")


@bp.route(
    "/<int:question_id>/answers", methods=["GET"], endpoint="get_answers_for_question"
)
@collect_query_params(Answer)
def get_all_answers_by_questionId(question_id, page, per_page, sort_column, sort_order):
    answers = (
        Answer.query.filter_by(question_id=question_id)
        .order_by(sort_order(sort_column))
        .paginate(page=page, per_page=per_page)
    )
    answers_list = [answer.to_dict() for answer in answers.items]
    return jsonify(
        {
            "page": page,
            "size": len(answers.items),
            "total_pages": answers.pages,
            "answers": answers_list,
        }
    ), 200


@bp.route(
    "/all/answers/current", methods=["GET"], endpoint="get_answers_for_current_user"
)
@login_check
@collect_query_params(Answer)
def get_all_answers_by_current_user(page, per_page, sort_column, sort_order):
    answers = (
        Answer.query.filter_by(user_id=current_user.id)
        .order_by(sort_order(sort_column))
        .paginate(page=page, per_page=per_page)
    )
    answers_list = [answer.to_dict() for answer in answers]
    return jsonify(
        {
            "page": page,
            "size": len(answers.items),
            "total_pages": answers.pages,
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
@csrf_protect
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
@csrf_protect
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
@csrf_protect
@login_check
@answer_exist_check
@answer_ownership_check
def delete_answer_by_questionId_and_answerId(question_id, answer_id):
    answer = Answer.query.get(answer_id)
    db.session.delete(answer)
    db.session.commit()
    return jsonify({"message": "answer deleted"})


@bp.route("/<int:question_id>/answers/<int:answer_id>/accept", methods=["PUT"])
@csrf_protect
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
