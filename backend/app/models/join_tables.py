from .db import db
from .question import Question
from .tag import Tag

question_tags = db.Table(
    "question_tags",
    db.Column(
        "question_id", db.Integer, db.ForeignKey("questions.id", primary_key=True)
    ),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id", primary_key=True)),
)
