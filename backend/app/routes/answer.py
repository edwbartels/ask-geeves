from flask import Blueprint,jsonify,request
from flask_login import current_user
from ..models.answer import Answer

from ..models.db import db


bp = Blueprint("answer", __name__, url_prefix="/answers")


@bp.route("/<int:question_id>", methods=["GET"])
def get_all_answers_by_questionId(question_id):
    answers = Answer.query.filter_by(question_id=question_id).all()
    if not answers:
        return jsonify({"message": "No answers found for this question"})
    answers_list = [
        {
            "id": answer.id,
            "user_id": answer.user_id,
            "question_id": answer.question_id,
            "content": answer.content,
            "created_at": answer.created_at,
            "updated_at": answer.updated_at,
            "accepted":answer.accepted
        }
        for answer in answers
    ]
    return jsonify({"answers": answers_list}), 200

@bp.route("/<int:question_id>/currentuser", methods=["GET"])
def get_all_answers_by_questionId_and_currentUser(question_id):
    answers = Answer.query.filter_by(question_id=question_id,user_id=current_user.id).all()
    if not answers:
        return jsonify({"message": "No answers found by this user"})   
    answers_list = [
        {
            "id": answer.id,
            "user_id": answer.user_id,
            "question_id": answer.question_id,
            "content": answer.content,
            "created_at": answer.created_at,
            "updated_at": answer.updated_at,
            "accepted":answer.accepted
        }
        for answer in answers
    ]
    return jsonify({"answers": answers_list}), 200
