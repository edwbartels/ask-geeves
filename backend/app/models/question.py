from .db import db
from datetime import datetime, timezone


def formatted_date_with_suffix(date):
    if date is None:
        return ""

    day = int(date.strftime("%d"))
    suffix = (
        "th" if 11 <= day <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    )
    return date.strftime(f"%B {day}{suffix}, %Y")


class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )
    answers = db.relationship("Answer", backref="question", cascade="all delete-orphan")
    comments = db.relationship(
        "Comment", backref="question", cascade="all delete-orphan"
    )
    saves = db.relationship(
        "Save",
        primaryjoin="and_(foreign(Save.content_id) == Question.id, Save.content_type=='question')",
        cascade="all, delete-orphan",
        viewonly=True,
        uselist=True,
    )

    @property
    def formatted_created_at(self):
        return formatted_date_with_suffix(self.created_at)

    @property
    def formatted_updated_at(self):
        return formatted_date_with_suffix(self.updated_at)

    def __repr__(self):
        return f"Question {self.id}"
