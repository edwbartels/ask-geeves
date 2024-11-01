from flask import Blueprint,flash,jsonify
from flask_login import current_user, login_user, logout_user
from ..utils.forms import LoginForm
from ..models.user import User

bp = Blueprint("session", __name__, url_prefix="/session")


@bp.route("/", methods=["GET"])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({"user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name
        }}), 200
    return jsonify({"user": "null"})

@bp.route("/", methods=["POST"])
def login():
    if current_user.is_authenticated:
        return jsonify({"message": "already logged in bro"}), 200
    #should hide login button
    
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        user = User.query.filter(User.username == username).first()
        if not user or not user.check_password(form.password.data):
            flash("wrong!")
            return jsonify({"error": "Invalid username or password"}), 401
        login_user(user)
        return jsonify({"user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }}), 200
    return jsonify({"error": "something wrong with form input"})

@bp.route('/logout', methods=["POST"])
def logout():
    if not current_user.is_authenticated:
        return jsonify({"error": "No user logged in"})
        #should hide logout button if no current user
    logout_user()
    return jsonify({"message":"success"}), 200
