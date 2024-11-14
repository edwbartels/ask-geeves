from flask import Blueprint, jsonify, request
from flask_login import current_user
from ..models.user import User
from ..models.question import Question
from ..models.answer import Answer
from ..models.comment import Comment
from ..models.db import db
from ..utils.decorator import login_check
from ..utils.errors import ValidationError

bp = Blueprint("user", __name__, url_prefix="/api/user")


@bp.route("/register", methods=["POST"])
def sign_up():
    if current_user.is_authenticated:
        return jsonify({"message": "already logged in bro"}), 200
    # should hide signup button
    data = request.get_json()
    errors = []
    if not data.get("username"):
        errors.append(("username", "Username is required"))
    if not data.get("email"):
        errors.append(("email", "Email is required"))
    if not data.get("first_name"):
        errors.append(("first_name", "First Name is required"))
    if not data.get("last_name"):
        errors.append(("last_name", "Last Name is required"))
    if not data.get("password"):
        errors.append(("password", "Password is required"))
    if not data.get("confirm_password"):
        errors.append(("confirm_password", "Confirm Password is required"))
    if data.get("password") and data.get("confirm_password"):
        if data["password"] != data["confirm_password"]:
            errors.append(("confirm_password", "Passwords must match"))
    if User.query.filter_by(username=data.get("username")).first():
        errors.append(("username", "Username is already registered"))
    if User.query.filter_by(email=data.get("email")).first():
        errors.append(("email", "Email is already registered"))

    if errors:
        raise ValidationError(errors=errors)

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


@bp.route("/<int:user_id>", methods=["GET"])
def get_user_detail_by_id(user_id):
    user = User.query.get(user_id)
    userInfo = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
    }
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
                "answer_id": answer.id,
                "comment_id": comment.id,
                "comment_content": comment.content,
            }
            comment_list.append(newC)

    return jsonify(
        {
            "User": userInfo,
            "questions": question_list,
            "answers": answer_list,
            "comments": comment_list,
        }
    )


@bp.route("/current", methods=["GET"])
@login_check
def get_detail_for_current_user():
    user = User.query.get(current_user.id)
    userInfo = {"first_name": user.first_name, "last_name": user.last_name}
    user_id = current_user.id
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
                "answer_id": answer.id,
                "comment_id": comment.id,
                "comment_content": comment.content,
            }
            comment_list.append(newC)

    return jsonify(
        {
            "User": userInfo,
            "questions": question_list,
            "answers": answer_list,
            "comments": comment_list,
        }
    )
