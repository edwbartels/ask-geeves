from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy import event
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from ..utils.formatting_methods import format_date


class Base(db.Model):
    __abstract__ = True

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower() + "s"

    @property
    def model_name(self):
        return self.__class__.__name__.lower()

    @declared_attr
    def __table_args__(cls):
        if environment == "production":
            return {"schema": SCHEMA}
        return {}
        return cls.__name__.lower()

    id = db.Column(db.Integer, primary_key=True)


class BelongsToUser(Base):
    __abstract__ = True

    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )


class HasTimestamps(Base):
    __abstract__ = True
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )

    @property
    @format_date("short")
    def created_at_short(self):
        return self.created_at

    @property
    @format_date("my")
    def created_at_my(self):
        return self.created_at

    @property
    @format_date("long")
    def created_at_long(self):
        return self.created_at

    @property
    @format_date("long_suffix")
    def created_at_long_suffix(self):
        return self.created_at

    @property
    @format_date("short")
    def updated_at_short(self):
        return self.updated_at

    @property
    @format_date("my")
    def updated_at_my(self):
        return self.updated_at

    @property
    @format_date("long")
    def updated_at_long(self):
        return self.updated_at

    @property
    @format_date("long_suffix")
    def updated_at_long_suffix(self):
        return self.updated_at

    def set_update(self, *attr_names):
        for attr_name in attr_names:
            event.listen(
                getattr(self.__class__, attr_name), "set", self._update_on_change
            )

    def _update_on_change(self, target, value, oldvalue, initiator):
        if value != oldvalue:
            target.updated_at = datetime.now(timezone.utc)
        return value


class HasVotes(Base):
    __abstract__ = True

    total_score = db.Column(db.Integer, default=0)

    def update_total_score(self, session):
        from .vote import Vote

        self.total_score = (
            session.query(db.func.sum(Vote.value))
            .filter(Vote.content_type == self.model_name, Vote.content_id == self.id)
            .scalar()
            or 0
        )
        session.commit()
