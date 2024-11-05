from .db import db


class Save(db.Model):
    __tablename__ = "saves"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content_id = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String(20), nullable=False)
    parent_type = db.Column(db.String(20), nullable=True)

    def __repr__(self):
        return f"<Save {self.id} - {self.content_type} {self.content_id}"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username":self.user.username,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name, 
            "content_id": self.content_id,
            "content_type": self.content_type,
            "parent_type": self.parent_type,
        }

    __table_args__ = (
        db.UniqueConstraint(
            "user_id", "content_type", "content_id", name="unique_save_user"
        ),
    )
