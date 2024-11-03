from flask import Blueprint,jsonify,request
from flask_login import current_user
from ..models.question import Question
from ..models.answer import Answer
from ..models.comment import Comment
from ..models.save import Save
from ..models.tag import Tag
from ..models.db import db
from ..utils.decorator import auth_check,question_exist_check,question_ownership_check

bp = Blueprint("topic", __name__, url_prefix="/questions")


@bp.route("/topics")
def get_all_topics():
    tags = Tag.query.all()
    tag_list=[]
    for tag in tags:
        each_tag = {
            "id":tag.id,
            "name":tag.name
        }
        tag_list.append(each_tag)
    return jsonify({"tags":tag_list})

