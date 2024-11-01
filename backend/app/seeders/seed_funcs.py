from .seed_lists import users, questions, answers, comments, tags, question_tags_list
from ..models import db, User, Question, Answer, Comment, Tag, question_tags


def seed_users():
    for entry in users:
        user = User(**entry)
        db.session.add(user)
    db.session.commit()


def seed_questions():
    for entry in questions:
        question = Question(**entry)
        db.session.add(question)
    db.session.commit


def seed_answers():
    for entry in answers:
        answer = Answer(**entry)
        db.session.add(answer)
    db.session.commit


def seed_comments():
    for entry in comments:
        comment = Comment(**entry)
        db.session.add(comment)
    db.session.commit()


def seed_tags():
    for entry in tags:
        tag = Tag(**entry)
        db.session.add(tag)
    db.session.commit()


# def seed_question_tags():
#     for entry in question_tags_list:
#         db.session.execute(
#             question_tags.insert().values(
#                 question_id=entry["question_id"], tag_id=entry["tag_id"]
#             )
#         )
#     db.session.commit()


def seed_all():
    seed_users()
    seed_tags()
    seed_questions()
    seed_answers()
    seed_comments()
    # seed_question_tags()
