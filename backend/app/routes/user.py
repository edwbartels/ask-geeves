from flask import Blueprint,jsonify,request
from flask_login import current_user
from ..models.user import User
from ..models.db import db
bp = Blueprint("user", __name__, url_prefix="/user")

@bp.route("/register",methods=["POST"])
def sign_up():
    if current_user.is_authenticated:
        return jsonify({"message": "already logged in bro"}), 200
    #should hide signup button
    data = request.get_json()
    # print(data)
    if not data:
        return jsonify({"error": "something wrong with request format"})

    errors = {}
    #? validation check?
    if User.query.filter_by(username=data.get('username')).first():
        errors['username'] = 'Username is already registered'
    if User.query.filter_by(email=data.get('email')).first():
        errors['email'] = 'Email is already registered'
    if errors:
        return jsonify({"errors": errors}), 400

    new_user = User(
        username=data['username'],
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    new_user.password = data['password']
    # print(new_user)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "first_name": new_user.first_name,
            "last_name": new_user.last_name
        }
    }), 201
