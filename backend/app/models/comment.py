from .db import db
from .base_models import HasTimestamps, BelongsToUser, HasVotes
from flask_login import current_user


class Comment(BelongsToUser, HasTimestamps, HasVotes):
    content = db.Column(db.Text, nullable=False)
    content_id = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String(20), nullable=False)

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
        saves = [
            save.to_dict()
            for save in self.saves
            if current_user.is_authenticated and save.user_id == current_user.id
        ]
        status = False
        if saves:
            status = True
        return {
            "id": self.id,
            "user_id": self.user.id,
            # "commentSave": status,
            "content_type": self.content_type,
            "content_id": self.content_id,
            "content": self.content,
            "total_score": self.total_score,
            "created_at": self.created_at_long_suffix,
            "updated_at": self.updated_at_long_suffix,
            "CommentUser": self.user.to_dict_basic_info(),
        }

    def for_question_detail(self):
        saves = [
            save.to_dict()
            for save in self.saves
            if current_user.is_authenticated and save.user_id == current_user.id
        ]
        status = False
        if saves:
            status = True
        return {
            "id": self.id,
            "commentSave": status,
            "content_type": self.content_type,
            "content_id": self.content_id,
            "content": self.content,
            "CommentUser": self.user.to_dict_basic_info(),
        }
