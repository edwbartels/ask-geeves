from .db import db


class Vote(db.Model):
    __tablename__ = "votes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    value = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String, nullable=False)
    content_id = db.Column(db.Integer, nullable=False)

    __table_args__ = (
        db.UniqueConstraint("user_id", "content_type", "content_id"),
        db.CheckConstraint("value IN (-1, 0, 1)", name="check_vote_value"),
    )

    def to_dict(self):
        return{
            # "id":self.id,
            # "user_id":self.user_id,
            "value":self.value,
            "content_type":self.content_type,
            "content_id":self.content_id
        }