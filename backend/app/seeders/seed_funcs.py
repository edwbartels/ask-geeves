from .seed_lists import (
    users,
    questions,
    answers,
    comments,
    tags,
    question_tags_list,
    votes,
    saves,
)
from ..models import db, User, Question, Answer, Comment, Tag, question_tags, Vote, Save


def seed_users():
    for entry in users:
        user = User(**entry)
        db.session.add(user)
    db.session.commit()


def seed_questions():
    for entry in questions:
        question = Question(**entry)
        db.session.add(question)
    db.session.commit()


def seed_answers():
    for entry in answers:
        answer = Answer(**entry)
        db.session.add(answer)
    db.session.commit()


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


def seed_question_tags():
    for entry in question_tags_list:
        db.session.execute(
            question_tags.insert().values(
                question_id=entry["question_id"], tag_id=entry["tag_id"]
            )
        )
    db.session.commit()


def seed_votes():
    for entry in votes:
        vote = Vote(**entry)
        db.session.add(vote)
    db.session.commit()


def seed_saves():
    for entry in saves:
        save = Save(**entry)
        db.session.add(save)
    db.session.commit()


def update_all_total_scores():
    questions = Question.query.all()
    for question in questions:
        question.update_total_score(db.session)

    answers = Answer.query.all()
    for answer in answers:
        answer.update_total_score(db.session)

    comments = Comment.query.all()
    for comment in comments:
        comment.update_total_score(db.session)

    db.session.commit()


def seed_all():
    seed_users()
    seed_tags()
    seed_questions()
    seed_answers()
    seed_comments()
    seed_question_tags()
    seed_votes()
    seed_saves()
    update_all_total_scores()


def clear_all_data():
    db.session.execute(question_tags.delete())  # Clear join table entries first
    db.session.query(Comment).delete()
    db.session.query(Answer).delete()
    db.session.query(Question).delete()
    db.session.query(Tag).delete()
    db.session.query(User).delete()
    db.session.query(Vote).delete()
    db.session.commit()
