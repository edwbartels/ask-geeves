from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user
from ..models.user import User
from sqlalchemy import or_
from ..utils.errors import ValidationError, AuthenticationError

bp = Blueprint("session", __name__, url_prefix="/api/session")


@bp.route("/", methods=["GET"])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({"user": current_user.to_dict()}), 200
    return jsonify({"user": None})


@bp.route("/", methods=["POST"])
def login():
    if current_user.is_authenticated:
        return jsonify({"message": "already logged in bro"})
    # should hide login button
    data = request.get_json()
    credential = data.get("credential")
    password = data.get("password")
    errors = []
    if not credential:
        errors.append(("credential", "username/email is required"))
    if not password:
        errors.append(("password", "password is required"))
    if errors:
        raise ValidationError(errors=errors)

    user = User.query.filter(
        or_(User.username == credential, User.email == credential)
    ).first()
    if not user:
        raise AuthenticationError("User not found")
    if not user.check_password(password):
        raise AuthenticationError("Invalid password")

    login_user(user, remember=True)
    return jsonify({"user": user.to_dict()}), 200


@bp.route("/", methods=["DELETE"])
def logout():
    if not current_user.is_authenticated:
        return jsonify({"error": "No user logged in"}), 401

    logout_user()
    return jsonify({"message": "Logout success"}), 200
