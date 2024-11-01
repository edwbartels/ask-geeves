from flask import Blueprint,jsonify
from flask_login import current_user
from ..utils.forms import SignupForm
from ..models.user import User

bp = Blueprint("user", __name__, url_prefix="/user")

@bp.route("/register")
def sign_up():
    form = SignupForm()
    print(form.data)
    return "hi"
