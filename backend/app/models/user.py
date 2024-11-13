from .db import db
from sqlalchemy import func
from sqlalchemy.orm import foreign
from .base_models import HasTimestamps
from flask_login import UserMixin
from .join_tables import follow_data
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone


class User(HasTimestamps, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(24), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    _hashed_password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)

    questions = db.relationship(
        "Question", backref="user", cascade="all, delete-orphan", lazy=True
    )
    answers = db.relationship(
        "Answer", backref="user", cascade="all, delete-orphan", lazy=True
    )
    comments = db.relationship(
        "Comment", backref="user", cascade="all, delete-orphan", lazy=True
    )
    saves = db.relationship(
        "Save", backref="user", cascade="all, delete-orphan", lazy=True
    )
    votes = db.relationship(
        "Vote", backref="user", cascade="all, delete-orphan", lazy=True
    )
    followers = db.relationship(
        "User",
        secondary=follow_data,
        primaryjoin=(follow_data.c.following_id == id),
        secondaryjoin=(follow_data.c.followed_by_id == id),
        backref=db.backref("following", lazy="dynamic"),
        lazy="dynamic",
    )

    @property
    def password(self):
        raise AttributeError("Password is not readable")

    @password.setter
    def password(self, password):
        self._hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self._hashed_password, password)

    @property
    def follower_count(self):
        return self.followers.count()

    @property
    def following_count(self):
        return self.followers.count()

    def get_followers(self):
        return [{"id": user.id, "username": user.username} for user in self.followers]

    def get_following(self):
        return [{"id": user.id, "username": user.username} for user in self.following]

    def is_following(self, user):
        return self.following.filter_by(id = user.id).count() > 0

    def is_followed_by(self, user):
        return self.followers.filter_by(id = user.id).count() > 0

    def follow(self, user):
        if not self.is_following(user):
            self.following.append(user)

    def unfollow(self, user):
        if self.is_following(user):
            self.following.remove(user)

    def __repr__(self):
        return f"<User {self.username} {self.email}>"

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "votes": [vote.to_dict_session() for vote in self.votes],
            "saves": [save.to_dict_session() for save in self.saves],
            "followers": self.get_followers(),
            "following": self.get_following(),
        }

    def to_dict_basic_info(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
        }
