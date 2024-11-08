from flask import Blueprint, jsonify, request
from flask_login import current_user
from ..models.user import User
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
