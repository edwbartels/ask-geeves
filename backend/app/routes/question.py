from flask import Blueprint,jsonify,request
from flask_login import current_user
from ..models.question import Question
from ..models.db import db
from ..utils.decorator import (auth_check,question_exist_check,question_ownership_check)

bp = Blueprint("question", __name__, url_prefix="/questions")



@bp.route("/", methods=["GET"])
def get_all_questions():
    all_questions = Question.query.all()
    if not all_questions:
        return jsonify({"message": "No questions found"}), 404
    questions_list = []
    for question in all_questions:
        eachQuestion = question.to_dict()
        questions_list.append(eachQuestion)
    return jsonify({"questions": questions_list})


@bp.route("/<int:question_id>", methods=["GET"])
def get_question_by_id(question_id):
    question = Question.query.get(question_id)
    if question:
        return jsonify({"question": question.to_dict()})
    else:
        return jsonify({"error": "Question not found"})


@bp.route("/current", methods=["GET"])
@auth_check
def get_questions_by_current_user():
    user_questions = Question.query.filter_by(user_id=current_user.id).all()
    questions_list = [ question.to_dict() for question in user_questions]
    return jsonify({"questions_owned": questions_list}), 200


@bp.route("/", methods=["POST"])
@auth_check
def create_question():
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
    return jsonify({"question": new_question.to_dict()}), 201   


@bp.route("/<int:question_id>", methods=["PUT"])
@auth_check
@question_exist_check
@question_ownership_check
def edit_question(question_id):
    question = Question.query.get(question_id)
    data = request.get_json()
    # ? validate check
    # if not data:
    #     return jsonify({"error": "Content is required"})
    question.content = data['content']
    db.session.commit()

    return jsonify({"question":question.to_dict()}), 200

@bp.route("/<int:question_id>", methods=["DELETE"])
@auth_check
@question_exist_check
@question_ownership_check
def delete_question(question_id):
    question = Question.query.get(question_id)
    db.session.delete(question)
    db.session.commit()
    return jsonify({"message": "question deleted"})
