from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy import event
from .db import db
from datetime import datetime, timezone
from ..utils.formatting_methods import format_date_long_suffix


class Base(db.Model):
    __abstract__ = True

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower() + "s"

    id = db.Column(db.Integer, primary_key=True)


def formatted_date_with_suffix(date):
    if date is None:
        return ""

    day = int(date.strftime("%d"))
    suffix = (
        "th" if 11 <= day <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    )
    return date.strftime(f"%B {day}{suffix}, %Y")


class Timestamp(Base):
    __abstract__ = True
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )

    @format_date_long_suffix
    @property
    def formatted_created_at(self):
        return self.created_at

    @format_date_long_suffix
    @property
    def formatted_updated_at(self):
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
