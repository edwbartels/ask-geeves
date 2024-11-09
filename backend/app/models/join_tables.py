from .db import db
import os
from .base_models import Base

schema = os.getenv("SCHEMA") if os.getenv("FLASK_ENV") == "production" else None

question_tags = db.Table(
    "question_tags",
    Base.metadata,
    db.Column(
        "question_id", db.Integer, db.ForeignKey("questions.id"), primary_key=True
    ),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
    schema=schema,
)
