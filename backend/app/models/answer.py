from .db import db
from .vote import Vote
from datetime import datetime, timezone
from flask_login import current_user

def formatted_date_with_suffix(date):
    if date is None:
        return ""

    day = int(date.strftime("%d"))
    suffix = (
        "th" if 11 <= day <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    )
    return date.strftime(f"%B {day}{suffix}, %Y")


class Answer(db.Model):
    __tablename__ = "answers"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    accepted = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )
    total_score = db.Column(db.Integer, default=0)

    comments = db.relationship(
        "Comment",
        primaryjoin="and_(Comment.content_id==foreign(Answer.id), Comment.content_type=='answer')",
        backref="answer",
        cascade="all, delete-orphan",
        viewonly=True,
        uselist=True,
        lazy=True
    )
    saves = db.relationship(
        "Save",
        primaryjoin="and_(foreign(Save.content_id) == Answer.id, Save.content_type == 'answer')",
        cascade="all, delete-orphan",
        viewonly=True,
        uselist=True,
        lazy=True
    )
    votes = db.relationship(
        "Vote",
        primaryjoin="and_(foreign(Vote.content_id)==Answer.id ,Vote.content_type=='answer')",
        cascade="all, delete-orphan",
        viewonly=True,
        lazy=True
    )

    @property
    def formatted_created_at(self):
        return formatted_date_with_suffix(self.created_at)

    @property
    def formatted_updated_at(self):
        return formatted_date_with_suffix(self.updated_at)

    def __repr__(self):
        return f"<Answer {self.id}. Accept: {'Yes' if self.accepted else 'No'}"

    def to_dict(self):
        saves = [save.to_dict() for save in self.saves if current_user.is_authenticated and save.user_id == current_user.id]
        status = False
        if saves:
            status = True
        return {
            "id": self.id,
            "question_id": self.question_id,
            "answerSave":status,
            "total_score": self.total_score,
            "accepted": self.accepted,
            "content": self.content,
            "created_at": self.formatted_created_at,
            "updated_at": self.formatted_updated_at,
            "AnswerUser": self.user.to_dict_basic_info(),
            "Comments": [comment.to_dict() for comment in self.comments],
        }

    def update_total_score(self, session):
        self.total_score = (
            session.query(db.func.sum(Vote.value))
            .filter(Vote.content_type == "answer", Vote.content_id == self.id)
            .scalar()
            or 0
        )
        session.commit()

    def for_question_detail(self):
        saves = [save.to_dict() for save in self.saves if current_user.is_authenticated and save.user_id == current_user.id]
        status = False
        if saves:
            status = True
        return {
            "id": self.id,
            "question_id": self.question_id,
            "answerSave":status,
            "accepted": self.accepted,
            "content": self.content,
            "created_at": self.formatted_created_at,
            "updated_at": self.formatted_updated_at,
            "total_score": self.total_score,
            "AnswerUser":self.user.to_dict_basic_info(),
            "Comments":[comment.for_question_detail() for comment in self.comments],
        }