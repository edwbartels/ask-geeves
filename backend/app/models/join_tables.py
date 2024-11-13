from .db import db, add_prefix_for_prod
import os
from .base_models import Base

schema = os.getenv("SCHEMA")
#  if os.getenv("FLASK_ENV") == "production" else None

question_tags = db.Table(
    "question_tags",
    Base.metadata,
    db.Column(
        "question_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("questions.id")),
        primary_key=True,
    ),
    db.Column(
        "tag_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("tags.id")),
        primary_key=True,
    ),
    schema=schema,
)

follow_data = db.Table(
    "follow_data",
    db.Column(
        "followed_by_id", db.Integer, db.ForeignKey("users.id"), primary_key=True
    ),
    db.Column("following_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
)
