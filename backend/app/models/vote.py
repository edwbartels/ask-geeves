from .db import db
from .answer import Answer
from .comment import Comment
from .base_models import BelongsToUser

class Vote(BelongsToUser):
    value = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String, nullable=False)
    content_id = db.Column(db.Integer, nullable=False)

    __table_args__ = (
        db.UniqueConstraint("user_id", "content_type", "content_id"),
        db.CheckConstraint("value IN (-1, 0, 1)", name="check_vote_value"),
    )

    @property
    def parent_type(self):
        if self.content_type == "comment":
            comment = Comment.query.get(self.content_id)
            return comment.content_type if comment else None
        return None

    @property
    def question_id(self):
        if self.content_type == "question":
            return self.content_id
        elif self.content_type == "answer":
            answer = Answer.query.get(self.content_id)
            return answer.question_id if answer else None
        elif self.content_type == "comment":
            comment = Comment.query.get(self.content_id)
            if comment:
                if comment.content_type == "question":
                    return comment.content_id
                elif comment.content_type == "answer":
                    parent_answer = Answer.query.get(comment.content_id)
                    return parent_answer.question_id if parent_answer else None
        return None

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "content_type": self.content_type,
            "content_id": self.content_id,
            "value": self.value,
            "parent_type": self.parent_type,
            "question_id": self.question_id,
        }

    def to_dict_session(self):
        return {
            "content_type": self.content_type,
            "content_id": self.content_id,
            "value": self.value,
        }

    def to_dict_current_user(self):
        res = {
            "question_id": self.question_id,
            "content_type": self.content_type,
            "value": self.value
        }
        if self.content_type == "comment":
            res["parent_type"] = self.parent_type
        return res