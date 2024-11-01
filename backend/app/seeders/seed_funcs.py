from .seed_lists import users, questions, answers, comments, tags, question_tags_list
from ..models import db, User, Question, Answer, Comment, Tags, question_tags


def seed_users():
    for entry in users:
        user = User(**entry)
        db.session.add(user)
    db.session.commit()
