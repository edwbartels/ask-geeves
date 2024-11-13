from flask import Blueprint, jsonify, request
from flask_login import current_user
from ..models.question import Question
from ..models.vote import Vote
from ..models.comment import Comment
from ..models.answer import Answer
from ..models.db import db
from ..utils.decorator import login_check
from sqlalchemy import case

bp = Blueprint("vote", __name__, url_prefix="/api")


@bp.route("/vote", methods=["POST"])
@login_check
def add_vote():
    data = request.get_json()
    user_id = current_user.id
    content_type = data.get("content_type")
    content_id = data.get("content_id")
    value = data.get("value")
    errors = {}
    if content_type == "question":
        question = Question.query.get(content_id)
        if not question:
            errors["question"] = "Question not found"
    if content_type == "answer":
        answer = Answer.query.get(content_id)
        if not answer:
            errors["answer"] = "Answer not found"
    if content_type == "comment":
        comment = Comment.query.get(content_id)
        if not comment:
            errors["comment"] = "Comment not found"

    if value not in [-1, 1]:
        errors["value"] = "value must be -1 or 1."

    if errors:
        return jsonify({"message": "Bad Request", "errors": errors}), 400

    existing_vote = Vote.query.filter_by(
        user_id=user_id, content_type=content_type, content_id=content_id
    ).first()

    if existing_vote:
        if existing_vote.value == value:
            existing_vote.value = 0
        else:
            existing_vote.value = value
        response_vote = existing_vote.to_dict_session()
    else:
        new_vote = Vote(
            user_id=user_id,
            value=value,
            content_type=content_type,
            content_id=content_id,
        )
        db.session.add(new_vote)
        response_vote = new_vote.to_dict_session()
    db.session.commit()

    if content_type == "comment":
        content = Comment.query.get(content_id)
        content.update_total_score(db.session)
    elif content_type == "question":
        content = Question.query.get(content_id)
        content.update_total_score(db.session)
    elif content_type == "answer":
        content = Answer.query.get(content_id)
        content.update_total_score(db.session)
    response_vote["total_score"] = content.total_score
    print(response_vote)

    return jsonify(response_vote), 200



@bp.route("/vote/current")
@login_check
def get_all_votes_for_current_user():
    user_id = current_user.id
    votes = Vote.query.filter_by(user_id=user_id).order_by(
        case(
            (Vote.content_type == "question", 1),
            (Vote.content_type == "answer", 2),
            (Vote.content_type == "comment", 3),
        )
    )
    vote_list = [vote.to_dict_current_user() for vote in votes]
    return jsonify({"votes": vote_list})
