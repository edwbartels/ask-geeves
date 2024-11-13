from .db import db
from .base_models import Base
from .join_tables import question_tags


class Tag(Base):
    name = db.Column(db.String(50), nullable=False)

    questions = db.relationship(
        "Question", secondary=question_tags, back_populates="tags"
    )

    def __repr__(self):
        return f"<Tag: {self.name}"

    def to_dict(self):
        return {"id": self.id, "name": self.name}
