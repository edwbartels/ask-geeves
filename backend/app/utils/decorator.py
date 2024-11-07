from flask import jsonify, request
from flask_login import current_user
from functools import wraps
from sqlalchemy import asc, desc
from ..models.question import Question
from ..models.answer import Answer
from ..models.comment import Comment


def login_check(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({"error": "not authenticated, need log in first"}), 401
        return func(*args, **kwargs)

    return wrapper


def question_exist_check(func):
    @wraps(func)
    def wrapper(question_id, *args, **kwargs):
        question = Question.query.get(question_id)
        if not question:
            return jsonify({"error": "question not found"}), 404
        return func(question_id, *args, **kwargs)

    return wrapper


def question_ownership_check(func):
    @wraps(func)
    def wrapper(question_id, *args, **kwargs):
        question = Question.query.get(question_id)
        if question.user_id != current_user.id:
            return jsonify(
                {"error": "not authenticated, not the owner of this question"}
            ), 403
        return func(question_id, *args, **kwargs)

    return wrapper


def answer_exist_check(func):
    @wraps(func)
    def wrapper(question_id, answer_id, *args, **kwargs):
        question = Question.query.get(question_id)
        if not question:
            return jsonify({"error": "question not found"}), 404
        answer = Answer.query.get(answer_id)
        if not answer:
            return jsonify({"error": "Answer not found"}), 404
        return func(question_id, answer_id, *args, **kwargs)

    return wrapper


def answer_ownership_check(func):
    @wraps(func)
    def wrapper(question_id, answer_id, *args, **kwargs):
        answer = Answer.query.get(answer_id)
        if answer.user_id != current_user.id:
            return jsonify({"error": "not authorized, not owner of this answer"}), 403
        return func(question_id, answer_id, *args, **kwargs)

    return wrapper


def comment_for_question_exist_check(func):
    @wraps(func)
    def wrapper(question_id, comment_id, *args, **kwargs):
        question = Question.query.get(question_id)
        if not question:
            return jsonify({"error": "question not found"}), 404
        comment = Comment.query.get(comment_id)
        if not comment:
            return jsonify({"error": "comment not found"}), 404
        return func(question_id, comment_id, *args, **kwargs)

    return wrapper


def comment_for_question_ownership_check(func):
    @wraps(func)
    def wrapper(question_id, comment_id, *args, **kwargs):
        comment = Comment.query.get(comment_id)
        if comment.user_id != current_user.id:
            return jsonify(
                {"error": "not authenticated, not the owner of this comment"}
            ), 403
        return func(question_id, comment_id, *args, **kwargs)

    return wrapper


def comment_for_answer_exist_check(func):
    @wraps(func)
    def wrapper(question_id, answer_id, comment_id, *args, **kwargs):
        question = Question.query.get(question_id)
        if not question:
            return jsonify({"error": "question not found"}), 404
        answer = Answer.query.get(answer_id)
        if not answer:
            return jsonify({"error": "answer not found"}), 404
        comment = Comment.query.get(comment_id)
        if not comment:
            return jsonify({"error": "comment not found"}), 404
        return func(question_id, answer_id, comment_id, *args, **kwargs)

    return wrapper


def comment_for_answer_ownership_check(func):
    @wraps(func)
    def wrapper(question_id, answer_id, comment_id, *args, **kwargs):
        comment = Comment.query.get(comment_id)
        if comment.user_id != current_user.id:
            return jsonify(
                {"error": "not authenticated, not the owner of this comment"}
            ), 403
        return func(question_id, answer_id, comment_id, *args, **kwargs)

    return wrapper


def collect_query_params(model):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            page, per_page, sort_by, order = (
                request.args.get(key, default, type=typ)
                for key, default, typ in [
                    ("page", 1, int),
                    ("per_page", 15, int),
                    ("sort_by", "created_at", str),
                    ("order", "desc", str),
                ]
            )

            sort_column = getattr(model, sort_by, model.created_at)
            sort_order = desc if order == "desc" else asc
            # print(f"Sorting by: {sort_column}, Order: {sort_order}")
            # print(*args, *kwargs, page, per_page, sort_column, sort_order)
            return func(
                *args,
                **kwargs,
                page=page,
                per_page=per_page,
                sort_column=sort_column,
                sort_order=sort_order,
            )

        return wrapper

    return decorator
