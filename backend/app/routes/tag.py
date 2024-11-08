from flask import Blueprint, jsonify, request
from ..models.tag import Tag
from ..models.question import Question
from ..models.db import db
from ..utils.decorator import (
    question_exist_check,
    question_ownership_check,
    login_check,
    csrf_protect,
)

bp = Blueprint("tags", __name__, url_prefix="/api/questions")


@bp.route("/tags")
def get_all_tags():
    tags = Tag.query.all()
    tag_list = []
    for tag in tags:
        tag_list.append(tag.to_dict())
    return jsonify({"tags": tag_list}), 200


@bp.route("/<int:question_id>/tags", methods=["GET"])
@csrf_protect
@question_exist_check
def get_all_tags_by_questionId(question_id):
    question = Question.query.get(question_id)
    tags = question.tags
    tags_list = [tag.to_dict() for tag in tags]
    return jsonify({"tags": tags_list}), 200


@bp.route("/<int:question_id>/tags", methods=["POST"])
@csrf_protect
@login_check
@question_exist_check
@question_ownership_check
def add_tag_to_question(question_id):
    question = Question.query.get(question_id)
    tags_list = [tag.to_dict() for tag in question.tags]
    data = request.get_json()
    input_tag = data.get("tag")

    exist_tag = Tag.query.filter_by(name=input_tag).first()

    if exist_tag:
        if exist_tag not in question.tags:
            question.tags.append(exist_tag)
            db.session.commit()
            tags_list = [tag.to_dict() for tag in question.tags]
            return jsonify({"tags": tags_list}), 201
        else:
            return jsonify({"message": "tag already exist"}), 200
    else:
        new_tag = Tag(name=input_tag)
        db.session.add(new_tag)
        question.tags.append(new_tag)
        db.session.commit()
        tags_list = [tag.to_dict() for tag in question.tags]
        return jsonify({"tags": tags_list}), 201


@bp.route("/<int:question_id>/tags/<int:tag_id>", methods=["DELETE"])
@csrf_protect
@login_check
@question_exist_check
@question_ownership_check
def delete_tag_from_question(question_id, tag_id):
    question = Question.query.get(question_id)

    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify({"error": "tag not found"}), 404
    if tag not in question.tags:
        return jsonify({"error": "tag did not add to this question"}), 404
    question.tags.remove(tag)
    db.session.commit()
    return jsonify({"message": "tag removed"}), 200
