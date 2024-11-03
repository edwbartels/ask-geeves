from flask import Blueprint,jsonify,request
from flask_login import current_user
from ..models.question import Question
from ..models.answer import Answer
from ..models.comment import Comment
from ..models.save import Save
from ..models.db import db
from ..utils.decorator import (auth_check,question_exist_check,question_ownership_check,
answer_exist_check,answer_ownership_check,comment_for_question_exist_check,
comment_for_question_ownership_check,comment_for_answer_exist_check,comment_for_answer_ownership_check)


bp = Blueprint("save", __name__, url_prefix="/saves")


@bp.route("/current")
@auth_check
def get_all_saves():
    saves = Save.query.filter_by(user_id=current_user.id).all()
    saves_list = [save.to_dict() for save in saves]
    return jsonify({"save":saves_list})

