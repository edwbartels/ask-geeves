from .db import db


class Save(db.Model):
    __tablename__ = "saves"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content_id = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"<Save {self.id} - {self.content_type} {self.content_id}"
        
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "content_id": self.content_id,
            "content_type": self.content_type
        }