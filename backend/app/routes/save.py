from flask import Blueprint,jsonify
from flask_login import current_user
from ..models.save import Save
from ..utils.decorator import (auth_check)

bp = Blueprint("save", __name__, url_prefix="/saves")

@bp.route("/current")
@auth_check
def get_all_saves():
    saves = Save.query.filter_by(user_id=current_user.id).all()
    saves_list = [save.to_dict() for save in saves]
    # question_ids = [save["content_id"] for save in saves_list]
    # saved_questions = []
    # for id in question_ids:
    #     question = Question.query.filter_by(id=id).first()
    #     saved_questions.append(question.to_dict())
    # return jsonify({"saved_questions":saved_questions})
    return jsonify({"all_saves":saves_list})

