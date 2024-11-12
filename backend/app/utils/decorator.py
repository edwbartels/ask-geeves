from flask import jsonify, request
from flask_login import current_user

# from flask_wtf.csrf import validate_csrf
from functools import wraps
from sqlalchemy import asc, desc
from ..models.question import Question
from ..models.answer import Answer
from ..models.comment import Comment
from ..models.tag import Tag
from .errors import ExistenceError , AuthorizationError

# def csrf_protect(func):
#     @wraps(func)
#     def wrapper(*args, **kwargs):
#         try:
#             csrf_token = request.headers.get("X-CSRF-Token")
#             validate_csrf(csrf_token)  # Validate against the token in the header
#         except Exception as e:
#             return jsonify({"error": f"CSRF token validation failed: {str(e)}"}), 400
#         return func(*args, **kwargs)

#     return wrapper


def existence_check(*QAC_id_pairs):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            errors = []
            for QAC, QAC_id in QAC_id_pairs:
                id = kwargs.get(QAC_id)
                model = globals().get(QAC)
                resource = model.query.get(id)
                if not resource:
                    errors.append((QAC, f"{QAC} not found"))
                    # errors.append((f"{QAC} not found"))
                else:
                    kwargs[QAC.lower()] = resource
                    # del kwargs[QAC_id]
            if errors:
                raise ExistenceError(errors=errors)
            
            return func(*args, **kwargs)
        
        return wrapper
    return decorator


def authorization_check(check,QAC_type):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            resource = kwargs.get(QAC_type)
            if not check(resource):
                raise AuthorizationError(resource=QAC_type)
            return func(*args, **kwargs)
        
        return wrapper
    return decorator

def owner_check(resource):
    return resource.user_id == current_user.id



def login_check(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({"message":"Authentication Error","error": "need log in first"}), 401
        return func(*args, **kwargs)

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
