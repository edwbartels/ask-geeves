from .db import db
from datetime import datetime, timezone
from .vote import Vote
from .join_tables import question_tags


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
    total_score = db.Column(db.Integer, default=0)

    answers = db.relationship(
        "Answer", backref="question", cascade="all, delete-orphan"
    )
    comments = db.relationship(
        "Comment",
        primaryjoin="and_(Comment.content_id == foreign(Question.id), Comment.content_type == 'question')",
        backref="question",
        cascade="all, delete-orphan",
        viewonly=True,
        uselist=True,
    )
    saves = db.relationship(
        "Save",
        primaryjoin="and_(foreign(Save.content_id) == Question.id, Save.content_type == 'question')",
        cascade="all, delete-orphan",
        viewonly=True,
        uselist=True,
    )
    tags = db.relationship("Tag", secondary=question_tags, back_populates="questions")
    votes = db.relationship(
        "Vote",
        primaryjoin="and_(foreign(Vote.content_type) =='question', Vote.content_id == Question.id)",
        cascade="all, delete-orphan",
        viewonly=True,
    )

    @property
    def formatted_created_at(self):
        return formatted_date_with_suffix(self.created_at)

    @property
    def formatted_updated_at(self):
        return formatted_date_with_suffix(self.updated_at)

    def __repr__(self):
        return f"Question {self.id}"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "content": self.content,
            "created_at": self.formatted_created_at,
            "updated_at": self.formatted_updated_at,
            "answers": [answer.to_dict() for answer in self.answers],
            "comments": [comment.to_dict() for comment in self.comments],
            "saves": [save.to_dict() for save in self.saves],
            "tags": [tag.to_dict() for tag in self.tags],
        }

    def update_total_score(self, session):
        self.total_score = (
            session.query(db.func.sum(Vote.value))
            .filter(Vote.content_type == "question", Vote.content_id == self.id)
            .scalar()
            or 0
        )
        session.commit()
