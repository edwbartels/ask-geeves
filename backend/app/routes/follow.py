from flask import Blueprint, jsonify, request
from flask_login import current_user
from ..models.db import db
from ..models.user import User
from ..utils.errors import ValidationError, ExistenceError, AuthorizationError
from ..utils.decorator import login_check

bp = Blueprint("follow", __name__, url_prefix="/api/follow")

@bp.route("/", methods=["GET"])
@login_check
def get_all_follows():
    user = User.query.get(current_user.id)
    return jsonify({"followers": user.get_followers(), "following": user.get_following()})

@bp.route("/", methods=["POST", "DELETE"])
@login_check
def follow_or_unfollow():
    data = request.get_json()
    target_user_id = data.get("target_user_id")

    if not target_user_id or target_user_id==current_user.id:
        raise ValidationError(errors=[("User", "Invalid user id")])

    target_user = User.query.get(target_user_id)
    if not target_user:
        raise ExistenceError(errors=[("User", "target user not found")])

    user = User.query.get(current_user.id)

    message = ""
    if request.method == "POST":
        if user.is_following(target_user):
            raise ValidationError(errors=[("User", "You already following this user")])
        user.follow(target_user)
        message = "Successfully followed"

    elif request.method == "DELETE":
        if not user.is_following(target_user):
            raise ValidationError(errors=[("User", "You are not following this user")])
        user.unfollow(target_user)
        message = "Successfully unfollowed"

    db.session.commit()

    return jsonify({"message": message, "following": user.get_following()})

