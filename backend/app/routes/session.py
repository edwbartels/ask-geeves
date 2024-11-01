from flask import Blueprint, redirect, render_template, url_for
from flask_login import current_user, login_user, logout_user
from ..utils.forms import LoginForm
from ..models.users import User

bp = Blueprint("session", __name__, url_prefix="/session")


@bp.route("/",methods=["GET"])
def homepage():
    return render_template("homepage")

@bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for(".homepage"))
    
    
    form = LoginForm()
    if form.validate_on_submit():
        n = form.username.data
        user = User.query.filter(User.username == n).first()
        if not user or not user.check_password(form.password.data):
            #invalid username
            return redirect(url_for(".login"))
        login_user(user)
        return redirect(url_for(".homepage"))
    return render_template("loginpage", form=form)


@bp.route('/logout', methods=["POST"])
def logout():
    logout_user()
    return redirect(url_for('.login'))
