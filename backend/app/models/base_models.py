from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy import event
from .db import db
from datetime import datetime, timezone
from ..utils.formatting_methods import format_date


class Base(db.Model):
    __abstract__ = True

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower() + "s"

    id = db.Column(db.Integer, primary_key=True)


class Timestamp(Base):
    __abstract__ = True
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )

    @format_date("short")
    @property
    def created_at_short(self):
        return self.created_at

    @format_date("my")
    @property
    def created_at_my(self):
        return self.created_at

    @format_date("long")
    @property
    def created_at_long(self):
        return self.created_at

    @format_date("long_suffix")
    @property
    def created_at_long_suffix(self):
        return self.created_at

    @format_date("short")
    @property
    def updated_at_short(self):
        return self.updated_at

    @format_date("my")
    @property
    def updated_at_my(self):
        return self.updated_at

    @format_date("long")
    @property
    def updated_at_long(self):
        return self.updated_at

    @format_date("long_suffix")
    @property
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
