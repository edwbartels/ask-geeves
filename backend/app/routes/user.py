from flask import Blueprint, jsonify, request
from flask_login import current_user
from ..models.user import User
from ..models.question import Question
from ..models.answer import Answer
from ..models.comment import Comment
from ..models.db import db

bp = Blueprint("user", __name__, url_prefix="/api/user")


@bp.route("/register", methods=["POST"])
# @csrf_protect
def sign_up():
    if current_user.is_authenticated:
        return jsonify({"message": "already logged in bro"}), 200
    # should hide signup button
    data = request.get_json()

    errors = {}
    if not data.get("username"):
        errors["username"] = "Username is required"
    if not data.get("email"):
        errors["email"] = "Email is required"
    if not data.get("first_name"):
        errors["firstName"] = "First Name is required"
    if not data.get("last_name"):
        errors["lastName"] = "Last Name is required"
    if not data.get("password"):
        errors["password"] = "Password is required"
    if not data.get("confirm_password"):
        errors["confirm_Password"] = "Confirm Password is required"
    if data.get("password") and data.get("confirm_password"):
        if data["password"] != data["confirm_password"]:
            errors["password"] = "Passwords must match"

    if User.query.filter_by(username=data.get("username")).first():
        errors["username"] = "Username is already registered"
    if User.query.filter_by(email=data.get("email")).first():
        errors["email"] = "Email is already registered"
    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400

    new_user = User(
        username=data["username"],
        email=data["email"],
        first_name=data["first_name"],
        last_name=data["last_name"],
    )
    new_user.password = data["password"]
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"user": new_user.to_dict()}), 201


@bp.route("/<int:user_id>")
def get_user_detail_by_id(user_id):
    question_list = []
    questions = Question.query.filter_by(user_id=user_id).all()
    for question in questions:
        newQ = {
            "question_id": question.id,
            "title": question.title,
            "question_content": question.content,
        }
        question_list.append(newQ)

    answer_list = []
    answers = Answer.query.filter_by(user_id=user_id).all()
    for answer in answers:
        answers_question = Question.query.get(answer.question_id)
        newA = {
            "question_id": answers_question.id,
            "title": answers_question.title,
            "question_content": answers_question.content,
            "answer_id": answer.id,
            "answer_content": answer.content,
        }
        answer_list.append(newA)
    
    comment_list = []
    comments = Comment.query.filter_by(user_id=user_id)
    for comment in comments:
        if comment.content_type == "question":
            question = Question.query.get(comment.content_id)
            newC = {
                "question_id": question.id,
                "title": question.title,
                "question_content": question.content,
                "parent_type": "question",
                "comment_id": comment.id,
                "comment_content": comment.content,
            }
            comment_list.append(newC)
    for comment in comments:
        if comment.content_type == "answer":
            answer = Answer.query.get(comment.content_id)
            question = Question.query.get(answer.question_id)
            newC = {
                "question_id": answer.id,
                "title": question.title,
                "question_content": answer.content,
                "parent_type": "answer",
                "comment_id": comment.id,
                "comment_content": comment.content,
            }
            comment_list.append(newC)

    return jsonify({"questions": question_list, "answers": answer_list ,"comments":comment_list})
