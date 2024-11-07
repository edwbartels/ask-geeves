from .db import db
from .base_models import Timestamp
from .vote import Vote
from flask_login import current_user


class Comment(Timestamp):
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)

    content_id = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String(20), nullable=False)
    total_score = db.Column(db.Integer, default=0)

    saves = db.relationship(
        "Save",
        primaryjoin="and_(foreign(Save.content_id) == Comment.id, Save.content_type == 'comment')",
        cascade="all, delete-orphan",
        viewonly=True,
        uselist=True,
        lazy=True,
    )
    votes = db.relationship(
        "Vote",
        primaryjoin="and_(foreign(Vote.content_id) == Comment.id, Vote.content_type == 'comment')",
        cascade="all, delete-orphan",
        viewonly=True,
        lazy=True,
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.set_update("content")

    def __repr__(self):
        return f"<Comment {self.id}"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user.id,
            "content_type": self.content_type,
            "content_id": self.content_id,
            "content": self.content,
            "total_score": self.total_score,
            "created_at": self.formatted_created_at,
            "updated_at": self.formatted_updated_at,
            "CommentUser": self.user.to_dict_basic_info(),
            "Saves": [
                save.to_dict()
                for save in self.saves
                if current_user.is_authenticated and current_user.id == save.user_id
            ],
        }

    def update_total_score(self, session):
        self.total_score = (
            session.query(db.func.sum(Vote.value))
            .filter(Vote.content_type == "comment", Vote.content_id == self.id)
            .scalar()
            or 0
        )
        session.commit()

    def for_question_detail(self):
        return {
            "id": self.id,
            "content_type": self.content_type,
            "content_id": self.content_id,
            "content": self.content,
            "CommentUser": self.user.to_dict_basic_info(),
        }
