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


@bp.route("/", methods=["POST"])
def create_question():
    if not current_user.is_authenticated:
        return jsonify({"error": "not authenticated"})

    data = request.get_json()
    #? validate check
    # if not data:
    #     return jsonify({"error": "Content is required"})
    new_question = Question(
        user_id=current_user.id,
        content = data['content']
    ##?more stuff?
    )
    db.session.add(new_question)
    db.seesion.commit()
    return jsonify({
            "id": new_question.id,
            "user_id": new_question.user_id,
            "created_at": new_question.created_at,
            "updated_at": new_question.updated_at
    })


@bp.route("/<int:id>", methods=["PUT"])
def edit_question(id):
    if not current_user.is_authenticated:
        return jsonify({"error": "not authenticated"})
    question = Question.query.get(id)
    if not question:
        return jsonify({"error": "Question not found"})
    if question.user_id != current_user.id:
        return jsonify({"error": "Unauthorized to edit this question"})
    data = request.get_json()
    # ? validate check
    # if not data:
    #     return jsonify({"error": "Content is required"})
    question.content = data['content']
    db.session.commit()

    return jsonify({
        "question": {
            "id": question.id,
            "user_id": question.user_id,
            "content": question.content,
        }
    }), 200

@bp.route("/<int:id>", methods=["DELETE"])
def delete_question(id):
    if not current_user.is_authenticated:
        return jsonify({"error": "not authenticated"})
    question = Question.query.get(id)
    if not question:
        return jsonify({"error": "Question not found"})
    if question.user_id != current_user.id:
        return jsonify({"error": "Unauthorized to delete this question"})
    db.session.delete(question)
    db.session.commit()
    return jsonify({"message": "Question deleted"})

