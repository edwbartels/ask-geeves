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

bp = Blueprint("question", __name__, url_prefix="/questions")



@bp.route("/", methods=["GET"])
def get_all_questions():
    all_questions = Question.query.all()
    if not all_questions:
        return jsonify({"message": "No questions found"}), 404
    questions_list = []
    for question in all_questions:
        eachQuestion = question.to_dict()
        questions_list.append(eachQuestion)
    return jsonify({"questions": questions_list})


@bp.route("/<int:question_id>", methods=["GET"])
def get_question_by_id(question_id):
    question = Question.query.get(question_id)
    if question:
        return jsonify({"question": question.to_dict()})
    else:
        return jsonify({"error": "Question not found"})


@bp.route("/current", methods=["GET"])
@auth_check
def get_questions_by_current_user():
    user_questions = Question.query.filter_by(user_id=current_user.id).all()
    questions_list = [ question.to_dict() for question in user_questions]
    return jsonify({"questions_owned": questions_list}), 200


@bp.route("/", methods=["POST"])
@auth_check
def create_question():
    data = request.get_json()
    #? validate check
    # if not data:
    #     return jsonify({"error": "Content is required"})
    new_question = Question(
        user_id=current_user.id,
        content = data['content']
    ##?more stuff?
    )
    db.session.add(new_question)
    db.session.commit()
    return jsonify({"question": new_question.to_dict()}), 201   


@bp.route("/<int:question_id>", methods=["PUT"])
@auth_check
@question_exist_check
@question_ownership_check
def edit_question(question_id):
    question = Question.query.get(question_id)
    data = request.get_json()
    # ? validate check
    # if not data:
    #     return jsonify({"error": "Content is required"})
    question.content = data['content']
    db.session.commit()

    return jsonify({"question":question.to_dict()}), 200

@bp.route("/<int:question_id>", methods=["DELETE"])
@auth_check
@question_exist_check
@question_ownership_check
def delete_question(question_id):
    question = Question.query.get(question_id)
    db.session.delete(question)
    db.session.commit()
    return jsonify({"message": "Question deleted"})

@bp.route("/<int:question_id>/answers", methods=["GET"])
def get_all_answers_by_questionId(question_id):
    answers = Answer.query.filter_by(question_id=question_id).all()
    answers_list = [answer.to_dict() for answer in answers]
    return jsonify({"answers": answers_list}), 200

@bp.route("/all/answers/current", methods=["GET"])
@auth_check
def get_all_answers_by_current_user():
    answers = Answer.query.filter_by(user_id=current_user.id).all()
    answers_list = [answer.to_dict() for answer in answers]
    return jsonify({"answers": answers_list}), 200

@bp.route("/<int:question_id>/answers/current", methods=["GET"])
@question_exist_check
def get_all_answers_by_questionId_and_currentUser(question_id):
    answers = Answer.query.filter_by(question_id=question_id,user_id=current_user.id).all()
    answers_list = [answer.to_dict() for answer in answers]
    return jsonify({"answers": answers_list}), 200

@bp.route("/<int:question_id>/answers", methods=["POST"])
@auth_check
@question_exist_check
def create_answer_by_questionId(question_id):
    data = request.get_json()
    new_answer= Answer(
        user_id=current_user.id,
        question_id=question_id,
        content=data["content"],
    )
    db.session.add(new_answer)
    db.session.commit()
    return jsonify({"answer":new_answer.to_dict()}), 201

@bp.route("/<int:question_id>/answers/<int:answer_id>", methods=["PUT"])
@auth_check
@answer_exist_check
@answer_ownership_check
def edit_answer_by_questionId_and_answerId(question_id,answer_id):
    answer = Answer.query.get(answer_id)
    data = request.get_json()
    # ? validate check
    # if not data:
    #     return jsonify({"error": "Content is required"})
    answer.content = data['content']
    db.session.commit()
    return jsonify({"answer":answer.to_dict()}), 200

@bp.route("/<int:question_id>/answers/<int:answer_id>", methods=["DELETE"])
@auth_check
@answer_exist_check
@answer_ownership_check
def delete_answer_by_questionId_and_answerId(question_id,answer_id):
    answer = Answer.query.get(answer_id)
    db.session.delete(answer)
    db.session.commit()
    return jsonify({"message":"answer deleted"})


@bp.route("/<int:question_id>/answers/<int:answer_id>/accept", methods=["PUT"])
@auth_check
@question_exist_check
@question_ownership_check
def mark_answer_accepted_by_questionId_and_answerId(question_id,answer_id):
    answer = Answer.query.get(answer_id)
    if not answer:
        return jsonify({"error": "Answer not found"})
    answer.accepted = not answer.accepted
    db.session.commit()
    return jsonify({"answer":answer.to_dict()}), 200


@bp.route("/<int:question_id>/comments", methods=["GET"])
@question_exist_check
def get_all_comments_for_question(question_id):
    comments = Comment.query.filter_by(content_id=question_id, content_type='question').all()
    comments_list = [comment.to_dict() for comment in comments]
    return jsonify({"comments": comments_list}), 200

@bp.route("/<int:question_id>/answers/<int:answer_id>/comments", methods=["GET"])
@question_exist_check
def get_all_comments_for_an_answer(question_id, answer_id):
    comments = Comment.query.filter_by(content_id=answer_id, content_type='answer').all()
    comments_list = [comment.to_dict() for comment in comments]
    return jsonify({"comments": comments_list}), 200

@bp.route("/<int:question_id>/allcomments", methods=["GET"])
@question_exist_check
def get_all_comments(question_id):
    comments_list = []

    question_comments = Comment.query.filter_by(content_id=question_id, content_type='question').all()
    for comment in question_comments:
        comments_list.append(comment.to_dict())

    answer_comments = []
    answer_ids = [answer.id for answer in Answer.query.filter_by(question_id=question_id).all()]
    for id in answer_ids:
        comments = Comment.query.filter_by(content_id=id, content_type='answer').all()
        answer_comments.extend(comments)

    for comment in answer_comments:
        comments_list.append(comment.to_dict())

    return jsonify({"comments": comments_list}), 200


@bp.route("/<int:question_id>/comments", methods=["POST"])
@auth_check
@question_exist_check
def create_comment_for_question(question_id):
    data = request.get_json()
    content = data.get("content")
    #? validation check?
    new_comment = Comment(
        user_id=current_user.id,
        content=content,
        content_id=question_id,
        content_type="question"
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"comment":new_comment.to_dict()})


@bp.route("/<int:question_id>/comments/<int:comment_id>", methods=["PUT"])
@auth_check
@comment_for_question_exist_check
@comment_for_question_ownership_check
def edit_comment_for_question(question_id,comment_id):
    data = request.get_json()
    new_content = data.get("content")
    #? validation check?
    comment = Comment.query.get(comment_id)
    comment.content = new_content
    db.session.commit()
    return jsonify({"comment":comment.to_dict()})


@bp.route("/<int:question_id>/comments/<int:comment_id>", methods=["DELETE"])
@auth_check
@comment_for_question_exist_check   
@comment_for_question_ownership_check
def delete_comment_for_question(question_id,comment_id):
    comment = Comment.query.get(comment_id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message":"comment for question deleted"})


@bp.route("/<int:question_id>/answers/<int:answer_id>/comments", methods=["POST"])
@auth_check
@question_exist_check
@answer_exist_check
def create_comment_for_answer(question_id,answer_id):
    data = request.get_json()
    content = data.get("content")
    #? validation check?
    new_comment = Comment(
        user_id=current_user.id,
        content=content,
        content_id=answer_id,
        content_type="answer"
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"comment":new_comment.to_dict()})

@bp.route("/<int:question_id>/answers/<int:answer_id>/comments/<int:comment_id>", methods=["PUT"])
@auth_check
@comment_for_answer_exist_check
@comment_for_answer_ownership_check
def edit_comment_for_answer(question_id,answer_id,comment_id):
    data = request.get_json()
    new_content = data.get("content")
    #? validation check?
    comment = Comment.query.get(comment_id)
    comment.content = new_content
    db.session.commit()
    return jsonify({"comment":comment.to_dict()})


@bp.route("/<int:question_id>/answers/<int:answer_id>/comments/<int:comment_id>", methods=["DELETE"])
@auth_check
@comment_for_answer_exist_check
@comment_for_answer_ownership_check
def delete_comment_for_answer(question_id,answer_id,comment_id):
    comment = Comment.query.get(comment_id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message":"comment for answer deleted"})


@bp.route("/<int:question_id>/saves", methods=["POST"])
@auth_check
@question_exist_check
def add_question_to_saves(question_id):
    save = Save.query.filter_by(user_id=current_user.id, content_id=question_id, content_type="question").first()
    if save:
        return jsonify({"message":"question already saved"})
    new_save = Save(
        user_id=current_user.id,
        content_id=question_id,
        content_type="question"
    )
    db.session.add(new_save)
    db.session.commit()
    return jsonify({"save":new_save.to_dict()})

@bp.route("/<int:question_id>/saves", methods=["DELETE"])
@auth_check
@question_exist_check
def delete_question_from_saves(question_id):
    save = Save.query.filter_by(user_id=current_user.id, content_id=question_id, content_type="question").first()   
    if not save:
        return jsonify({"error": "save not found"})
    db.session.delete(save)
    db.session.commit()
    return jsonify({"message": "question deleted from saves"})

@bp.route("/<int:question_id>/answers/<int:answer_id>/saves", methods=["POST"])
@auth_check
@answer_exist_check
def add_answer_to_saves(question_id, answer_id):
    save = Save.query.filter_by(user_id=current_user.id, content_id=answer_id, content_type="answer").first()
    if save:
        return jsonify({"message": "answer already saved"})
    new_save = Save(
        user_id=current_user.id,
        content_id=answer_id,
        content_type="answer"
    )
    db.session.add(new_save)
    db.session.commit()
    return jsonify({"save": new_save.to_dict()})


@bp.route("/<int:question_id>/answers/<int:answer_id>/saves", methods=["DELETE"])
@auth_check
@answer_exist_check
def delete_answer_from_saves(question_id, answer_id):
    save = Save.query.filter_by(user_id=current_user.id, content_id=answer_id, content_type="answer").first()
    if not save:
        return jsonify({"error": "save not found"})
    db.session.delete(save)
    db.session.commit()
    return jsonify({"message": "answer deleted from saves"})


@bp.route("/<int:question_id>/comments/<int:comment_id>/saves", methods=["POST"])
@auth_check
@comment_for_question_exist_check
def add_question_comment_to_saves(question_id, comment_id):
    save = Save.query.filter_by(user_id=current_user.id, content_id=comment_id, content_type="comment").first()
    if save:
        return jsonify({"message": "comment in question already saved"})

    new_save = Save(
        user_id=current_user.id,
        content_id=comment_id,
        content_type="comment",
        parent_type="question"
    )
    db.session.add(new_save)
    db.session.commit()
    return jsonify({"save": new_save.to_dict()})


@bp.route("/<int:question_id>/comments/<int:comment_id>/saves", methods=["DELETE"])
@auth_check
@comment_for_question_exist_check
def delete_question_comment_from_saves(question_id, comment_id):
    save = Save.query.filter_by(user_id=current_user.id, content_id=comment_id, content_type="comment").first()
    if not save:
        return jsonify({"error": "save not found"})
    db.session.delete(save)
    db.session.commit()
    return jsonify({"message": "comment in question deleted from saves"})


@bp.route("/<int:question_id>/answers/<int:answer_id>/comments/<int:comment_id>/saves", methods=["POST"])
@auth_check
@comment_for_answer_exist_check
def add_answer_comment_to_saves(question_id,answer_id, comment_id):
    save = Save.query.filter_by(user_id=current_user.id, content_id=comment_id, content_type="comment").first()
    if save:
        return jsonify({"message": "comment in answer already saved"})

    new_save = Save(
        user_id=current_user.id,
        content_id=comment_id,
        content_type="comment",
        parent_type="answer"
    )
    db.session.add(new_save)
    db.session.commit()
    return jsonify({"save": new_save.to_dict()})


@bp.route("/<int:question_id>/answers/<int:answer_id>/comments/<int:comment_id>/saves", methods=["DELETE"])
@auth_check
@comment_for_answer_exist_check
def delete_answer_comment_from_saves(question_id,answer_id, comment_id):
    save = Save.query.filter_by(user_id=current_user.id, content_id=comment_id, content_type="comment").first()
    if not save:
        return jsonify({"error": "save not found"})
    db.session.delete(save)
    db.session.commit()
    return jsonify({"message": "comment in answer deleted from saves"})
