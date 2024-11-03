from flask import jsonify
from flask_login import current_user
from functools import wraps
from ..models.question import Question

def auth_check(func):
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
            return jsonify({"error": "not authenticated, not the owner of this question"}), 403
        return func(question_id, *args, **kwargs)
    return wrapper
