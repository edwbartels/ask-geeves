from flask import Blueprint, jsonify
from flask_login import current_user
from ..models.save import Save
from ..models.db import db
from ..models.question import Question
from ..models.answer import Answer
from ..models.comment import Comment
from ..utils.decorator import (
    csrf_protect,
    login_check,
    question_exist_check,
    answer_exist_check,
    comment_for_question_exist_check,
    comment_for_answer_exist_check,
)

bp = Blueprint("save", __name__, url_prefix="/api/questions")


@bp.route("/usersaves")
@login_check
def get_all_saves():
    saves = Save.query.filter_by(user_id=current_user.id).all()
    saves_list = [save.to_dict() for save in saves]
    question_list = []
    for save in saves_list:
        if save["parent_type"] is None and save["content_type"] == "question":
            question_list.append(save)
    questions = []
    for saved_question in question_list:
        question = Question.query.get(saved_question["content_id"])
        questions.append(question.to_dict())
    final = []
    for question in questions:
        newQ = {
            "question_id": question["id"],
            "title": question["title"],
            # "content_type":"question",
            "question_content": question["content"],
        }
        final.append(newQ)
    answer_list = [
        save
        for save in saves_list
        if save["parent_type"] is None and save["content_type"] == "answer"
    ]
    for saved_answer in answer_list:
        answer = Answer.query.get(saved_answer["content_id"])
        question = Question.query.get(answer.question_id)
        newA = {
            "question_id": question.id,
            "title": question.title,
            "question_content": question.content,
            "answer_id": answer.id,
            # "content_type":"answer",
            "answer_content": answer.content,
        }
        final.append(newA)
    comment_list = [
        save
        for save in saves_list
        if save["parent_type"] in ["question", "answer"]
        and save["content_type"] == "comment"
    ]

    for saved_comment in comment_list:
        comment = Comment.query.get(saved_comment["content_id"])
        if saved_comment["parent_type"] == "question":
            question = Question.query.get(comment.content_id)
            new_comment = {
                "question_id": question.id,
                "title": question.title,
                # "content_type": "comment",
                "question_content": question.content,
                "parent_type": "question",
                "comment_id": saved_comment["content_id"],
                "comment_content": comment.content,
            }
            final.append(new_comment)
        elif saved_comment["parent_type"] == "answer":
            answer = Answer.query.get(comment.content_id)
            question = Question.query.get(answer.question_id)
            new_comment = {
                # "id": answer.id,
                "question_id": question.id,
                "title": question.title,
                # "content_type": "comment",
                "question_content": question.content,
                "parent_type": "answer",
                # "answer_content": answer.content,
                "comment_id": saved_comment["content_id"],
                "comment_content": comment.content,
            }
            final.append(new_comment)
    # print(final)
    return jsonify({"all_saves": final}), 200


@bp.route("/<int:question_id>/saves", methods=["POST"])
@csrf_protect
@login_check
@question_exist_check
def add_question_to_saves(question_id):
    save = Save.query.filter_by(
        user_id=current_user.id, content_id=question_id, content_type="question"
    ).first()
    if save:
        return jsonify({"message": "question already saved"}), 200
    new_save = Save(
        user_id=current_user.id, content_id=question_id, content_type="question"
    )
    db.session.add(new_save)
    db.session.commit()
    return jsonify({"save": new_save.to_dict()}), 201


@bp.route("/<int:question_id>/saves", methods=["DELETE"])
@csrf_protect
@login_check
@question_exist_check
def delete_question_from_saves(question_id):
    save = Save.query.filter_by(
        user_id=current_user.id, content_id=question_id, content_type="question"
    ).first()
    if not save:
        return jsonify({"error": "save not found"}), 404
    db.session.delete(save)
    db.session.commit()
    return jsonify({"message": "question deleted from saves"}), 200


@bp.route("/<int:question_id>/answers/<int:answer_id>/saves", methods=["POST"])
@csrf_protect
@login_check
@answer_exist_check
def add_answer_to_saves(question_id, answer_id):
    save = Save.query.filter_by(
        user_id=current_user.id, content_id=answer_id, content_type="answer"
    ).first()
    if save:
        return jsonify({"message": "answer already saved"}), 200
    new_save = Save(
        user_id=current_user.id, content_id=answer_id, content_type="answer"
    )
    db.session.add(new_save)
    db.session.commit()
    return jsonify({"save": new_save.to_dict()}), 201


@bp.route("/<int:question_id>/answers/<int:answer_id>/saves", methods=["DELETE"])
@csrf_protect
@login_check
@answer_exist_check
def delete_answer_from_saves(question_id, answer_id):
    save = Save.query.filter_by(
        user_id=current_user.id, content_id=answer_id, content_type="answer"
    ).first()
    if not save:
        return jsonify({"error": "save not found"}), 404
    db.session.delete(save)
    db.session.commit()
    return jsonify({"message": "answer deleted from saves"}), 200


@bp.route("/<int:question_id>/comments/<int:comment_id>/saves", methods=["POST"])
@csrf_protect
@login_check
@comment_for_question_exist_check
def add_question_comment_to_saves(question_id, comment_id):
    save = Save.query.filter_by(
        user_id=current_user.id, content_id=comment_id, content_type="comment"
    ).first()
    if save:
        return jsonify({"message": "comment in question already saved"}), 200

    new_save = Save(
        user_id=current_user.id,
        content_id=comment_id,
        content_type="comment",
        parent_type="question",
    )
    db.session.add(new_save)
    db.session.commit()
    return jsonify({"save": new_save.to_dict()}), 201


@bp.route("/<int:question_id>/comments/<int:comment_id>/saves", methods=["DELETE"])
@csrf_protect
@login_check
@comment_for_question_exist_check
def delete_question_comment_from_saves(question_id, comment_id):
    save = Save.query.filter_by(
        user_id=current_user.id, content_id=comment_id, content_type="comment"
    ).first()
    if not save:
        return jsonify({"error": "save not found"}), 404
    db.session.delete(save)
    db.session.commit()
    return jsonify({"message": "comment in question deleted from saves"}), 200


@bp.route(
    "/<int:question_id>/answers/<int:answer_id>/comments/<int:comment_id>/saves",
    methods=["POST"],
)
@login_check
@comment_for_answer_exist_check
def add_answer_comment_to_saves(question_id, answer_id, comment_id):
    save = Save.query.filter_by(
        user_id=current_user.id, content_id=comment_id, content_type="comment"
    ).first()
    if save:
        return jsonify({"message": "comment in answer already saved"}), 200

    new_save = Save(
        user_id=current_user.id,
        content_id=comment_id,
        content_type="comment",
        parent_type="answer",
    )
    db.session.add(new_save)
    db.session.commit()
    return jsonify({"save": new_save.to_dict()}), 201


@bp.route(
    "/<int:question_id>/answers/<int:answer_id>/comments/<int:comment_id>/saves",
    methods=["DELETE"],
)
@csrf_protect
@login_check
@comment_for_answer_exist_check
def delete_answer_comment_from_saves(question_id, answer_id, comment_id):
    save = Save.query.filter_by(
        user_id=current_user.id, content_id=comment_id, content_type="comment"
    ).first()
    if not save:
        return jsonify({"error": "save not found"}), 404
    db.session.delete(save)
    db.session.commit()
    return jsonify({"message": "comment in answer deleted from saves"}), 200
