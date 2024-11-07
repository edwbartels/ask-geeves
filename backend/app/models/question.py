from .db import db
from datetime import datetime, timezone
from .vote import Vote
from .join_tables import question_tags
from flask_login import current_user


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
    title = db.Column(db.Text, nullable=False)
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
        lazy=True,
    )
    saves = db.relationship(
        "Save",
        primaryjoin="and_(foreign(Save.content_id) == Question.id, Save.content_type == 'question')",
        cascade="all, delete-orphan",
        viewonly=True,
        uselist=True,
        lazy=True,
    )
    tags = db.relationship("Tag", secondary=question_tags, back_populates="questions")
    votes = db.relationship(
        "Vote",
        primaryjoin="and_(foreign(Vote.content_type) =='question', Vote.content_id == Question.id)",
        cascade="all, delete-orphan",
        viewonly=True,
        lazy=True,
    )

    @property
    def formatted_created_at(self):
        return formatted_date_with_suffix(self.created_at)

    @property
    def formatted_updated_at(self):
        return formatted_date_with_suffix(self.updated_at)

    def __repr__(self):
        return f"Question {self.id}"

    def to_dict(self, homepage=False, detail_page=False):
        if homepage:
            return {
                "id": self.id,
                "user_id": self.user.id,
                "title": self.title,
                "content": self.content,
                "created_at": self.formatted_created_at,
                "updated_at": self.formatted_updated_at,
                "total_score": self.total_score,
                "num_answers": len(self.answers),
                "num_votes": len(self.votes),
                "User": self.user.to_dict_basic_info(),
                "Tags": [tag.to_dict() for tag in self.tags],
            }
        elif detail_page:
            return {
                "id": self.id,
                "title": self.title,
                "content": self.content,
                "created_at": self.formatted_created_at,
                "updated_at": self.formatted_updated_at,
                "total_score": self.total_score,
                "num_votes": len(self.votes),
                "num_answers": len(self.answers),
                "Tags": [tag.to_dict() for tag in self.tags],
                "Votes": [
                    vote.to_dict()
                    for vote in self.votes
                    if current_user.is_authenticated and vote.user_id == current_user.id
                ],
                "QuestionUser": self.user.to_dict_basic_info(),
                "Comments": [
                    comment.for_question_detail() for comment in self.comments
                ],
                "Answers": [answer.for_question_detail() for answer in self.answers],
            }
        return {
            "id": self.id,
            "user_id": self.user.id,
            "title": self.title,
            "content": self.content,
            "created_at": self.formatted_created_at,
            "updated_at": self.formatted_updated_at,
            "total_score": self.total_score,
            "User": self.user.to_dict(),
            "Answers": [answer.to_dict() for answer in self.answers],
            "Comments": [comment.to_dict() for comment in self.comments],
            "Saves": [save.to_dict() for save in self.saves],
            "Tags": [tag.to_dict() for tag in self.tags],
        }

    def update_total_score(self, session):
        self.total_score = (
            session.query(db.func.sum(Vote.value))
            .filter(Vote.content_type == "question", Vote.content_id == self.id)
            .scalar()
            or 0
        )
        session.commit()

    def for_homepage(self):
        return {
            "id": self.id,
            "title": self.title,
            "total_score": self.total_score,
            "answers_count": len(self.answers),
            "comments_count": len(self.comments),
            "tags": [tag.to_dict() for tag in self.tags],
            "created_at": self.formatted_created_at,
            "updated_at": self.formatted_updated_at,
        }
