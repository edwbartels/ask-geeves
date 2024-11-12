from flask import Blueprint, jsonify,request
from flask_login import current_user
from ..models.save import Save
from ..models.db import db
from ..models.question import Question
from ..models.answer import Answer
from ..models.comment import Comment
from ..utils.decorator import login_check
from ..utils.errors import ValidationError,ExistenceError,AuthorizationError

bp = Blueprint("save", __name__, url_prefix="/api/saves")


@bp.route("/currentuser")
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
    return jsonify({"all_saves": final}), 200

@bp.route("/<int:save_id>", methods = ["POST","DELETE"])
@login_check
def add_or_delete_save(save_id):
    if request.method == "POST" and save_id==0:
        data = request.get_json()
        content_type = data.get("content_type")
        content_id = data.get("content_id")
        parent_type = data.get("parent_type")
        existing_save = Save.query.filter_by(
            content_id=content_id,
            content_type=content_type,
            parent_type=parent_type,
            user_id=current_user.id,
        ).first()
        if existing_save:
            raise ValidationError(errors=[("save","save already exist")])
        new_save = Save(
            content_id=content_id,
            content_type=content_type,
            parent_type=parent_type,
            user_id=current_user.id
        )
        db.session.add(new_save)
        db.session.commit()
        return new_save.to_dict(), 201

    elif request.method == "DELETE":
        save = Save.query.get(save_id)
        if not save:
            raise ExistenceError(errors=[("save","save not found")])
        if save.user_id != current_user.id:
            raise AuthorizationError("save")
        db.session.delete(save)
        db.session.commit()
        return {"message": "Save deleted successfully"}, 200


