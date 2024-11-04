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


class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )
    content_id = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String(20), nullable=False)
    saves = db.relationship(
        "Save",
        primaryjoin="and_(foreign(Save.content_id) == Comment.id, Save.content_type=='comment')",
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
        return f"<Comment {self.id}"
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username":self.user.username,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name, 
            "content": self.content,
            "created_at": self.formatted_created_at,
            "updated_at": self.formatted_updated_at,
            "content_id": self.content_id,
            "content_type": self.content_type,
            "saves": [save.to_dict() for save in self.saves]
        }