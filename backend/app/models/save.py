from .db import db
from .base_models import BelongsToUser
from flask_login import current_user


class Save(BelongsToUser):
    content_id = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String(20), nullable=False)
    parent_type = db.Column(db.String(20), nullable=True)

    def __repr__(self):
        return f"<Save {self.id} - {self.content_type} {self.content_id}"

    def to_dict(self):
        return {
            "id": self.id,
            "content_id": self.content_id,
            "content_type": self.content_type,
            "parent_type": self.parent_type,
            "user_id": current_user.id,
        }

    __table_args__ = (
        db.UniqueConstraint(
            "user_id", "content_type", "content_id", name="unique_save_user"
        ),
    )
