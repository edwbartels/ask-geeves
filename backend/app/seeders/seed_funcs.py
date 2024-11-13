from .seed_lists import (
    users,
    questions,
    answers,
    comments,
    tags,
    question_tags_list,
    votes,
    saves,
    follow_data_list,
)
from ..models import (
    db,
    User,
    Question,
    Answer,
    Comment,
    Tag,
    question_tags,
    Vote,
    Save,
    follow_data,
)

import os
from sqlalchemy.sql import text

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


def seed_users():
    try:
        for entry in users:
            user = User(**entry)
            db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error seeding users: {e}")


def undo_users():
    if environment == "production":
        db.session.execute(
            text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
        )
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()


def seed_questions():
    for entry in questions:
        question = Question(**entry)
        db.session.add(question)
    db.session.commit()


def undo_questions():
    if environment == "production":
        db.session.execute(
            text(f"TRUNCATE table {SCHEMA}.questions RESTART IDENTITY CASCADE;")
        )
    else:
        db.session.execute(text("DELETE FROM questions"))

    db.session.commit()


def seed_answers():
    for entry in answers:
        answer = Answer(**entry)
        db.session.add(answer)
    db.session.commit()


def undo_answers():
    if environment == "production":
        db.session.execute(
            text(f"TRUNCATE table {SCHEMA}.answers RESTART IDENTITY CASCADE;")
        )
    else:
        db.session.execute(text("DELETE FROM answers"))

    db.session.commit()


def seed_comments():
    for entry in comments:
        comment = Comment(**entry)
        db.session.add(comment)
    db.session.commit()


def undo_comments():
    if environment == "production":
        db.session.execute(
            text(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
        )
    else:
        db.session.execute(text("DELETE FROM comment"))

    db.session.commit()


def seed_tags():
    for entry in tags:
        tag = Tag(**entry)
        db.session.add(tag)
    db.session.commit()


def undo_tags():
    if environment == "production":
        db.session.execute(
            text(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
        )
    else:
        db.session.execute(text("DELETE FROM tags"))

    db.session.commit()


def seed_question_tags():
    for entry in question_tags_list:
        db.session.execute(
            question_tags.insert().values(
                question_id=entry["question_id"], tag_id=entry["tag_id"]
            )
        )
    db.session.commit()


    if environment == "production":
        db.session.execute(
            text(f"TRUNCATE table {SCHEMA}.question_tags RESTART IDENTITY CASCADE;")
        )
    else:
        db.session.execute(text("DELETE FROM question_tags"))
        
def seed_follow_data():
    for entry in follow_data_list:
        db.session.execute(
            follow_data.insert().values(
                followed_by_id=entry["followed_by_id"],
                following_id=entry["following_id"],
            )
        )
    db.session.commit()


def seed_votes():
    for entry in votes:
        vote = Vote(**entry)
        db.session.add(vote)
    db.session.commit()


def undo_votes():
    if environment == "production":
        db.session.execute(
            text(f"TRUNCATE table {SCHEMA}.votes RESTART IDENTITY CASCADE;")
        )
    else:
        db.session.execute(text("DELETE FROM votes"))

    db.session.commit()


def seed_saves():
    for entry in saves:
        save = Save(**entry)
        db.session.add(save)
    db.session.commit()


def undo_saves():
    if environment == "production":
        db.session.execute(
            text(f"TRUNCATE table {SCHEMA}.saves RESTART IDENTITY CASCADE;")
        )
    else:
        db.session.execute(text("DELETE FROM saves"))

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
    clear_all_data()
    seed_users()
    seed_tags()
    seed_questions()
    seed_answers()
    seed_comments()
    seed_question_tags()
    seed_follow_data()
    seed_votes()
    seed_saves()
    update_all_total_scores()


def clear_all_data():
    undo_users()
    undo_tags()
    undo_questions()
    undo_answers()
    undo_comments()
    undo_question_tags()
    undo_votes()
    undo_saves()
    # db.session.execute(question_tags.delete())  # Clear join table entries first
    # db.session.query(Comment).delete()
    # db.session.query(Answer).delete()
    # db.session.query(Question).delete()
    # db.session.query(Tag).delete()
    # db.session.query(User).delete()
    # db.session.query(Vote).delete()
    # db.session.commit()

