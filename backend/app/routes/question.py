from flask import Blueprint,jsonify,request
from flask_login import current_user
from ..models.question import Question
from ..models.db import db

bp = Blueprint("question", __name__, url_prefix="/questions")


@bp.route("/", methods=["GET"])
def get_all_questions():
    allQuestions = Question.query.all()
    questions_list = []
    for question in allQuestions:
        eachQuestion = {
            "id": question.id,
            "user_id": question.user_id,
            "content": question.content,
            "created_at": question.created_at,
            "updated_at": question.updated_at,
        }
        questions_list.append(eachQuestion)
    return jsonify({"Questions": questions_list})


@bp.route("/<int:id>", methods=["GET"])
def get_question_by_id(id):
    question = Question.query.get(id)
    if question:
        question_data = {
            "id": question.id,
            "user_id": question.user_id,
            "content": question.content,
            "created_at": question.created_at,
            "updated_at": question.updated_at
        }
        return jsonify({"Question": question_data})
    else:
        return jsonify({"error": "Question not found"})


# @bp.route("/", methods=["POST"])
# def create_question():
