from flask import Blueprint,jsonify,request
from flask_login import current_user
from ..models.question import Question
from ..models.db import db

bp = Blueprint("question", __name__, url_prefix="/questions")


@bp.route("/", methods=["GET"])
def get_all_questions():
    all_questions = Question.query.all()
    if not all_questions:
        return jsonify({"message": "No questions found"}), 404
    questions_list = []
    for question in all_questions:
        eachQuestion = {
            "id": question.id,
            "user_id": question.user_id,
            "content": question.content,
            "created_at": question.created_at,
            "updated_at": question.updated_at,
        }
        questions_list.append(eachQuestion)
    return jsonify({"Questions": questions_list})


@bp.route("/<int:question_id>", methods=["GET"])
def get_question_by_id(question_id):
    question = Question.query.get(question_id)
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


@bp.route("/current", methods=["GET"])
def get_questions_by_current_user():
    if not current_user.is_authenticated:
        return jsonify({"error": "not authenticated"})
    user_questions = Question.query.filter_by(user_id=current_user.id).all()
    if not user_questions:
        return jsonify({"message": "No questions found"}), 404
    questions_list = [
        {
            "id": question.id,
            "user_id": question.user_id,
            "content": question.content,
            "created_at": question.created_at,
            "updated_at": question.updated_at,
        }
        for question in user_questions
    ]
    return jsonify({"Questions": questions_list}), 200



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
    db.session.commit()
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

