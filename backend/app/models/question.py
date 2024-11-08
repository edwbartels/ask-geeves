from .db import db
from .base_models import HasTimestamps, HasVotes, BelongsToUser
from .join_tables import question_tags
from flask_login import current_user




class Question(BelongsToUser, HasTimestamps, HasVotes):
    content = db.Column(db.Text, nullable=False)
    title = db.Column(db.Text, nullable=False)

    answers = db.relationship(
        "Answer", backref="question", cascade="all, delete-orphan"
    )
    comments = db.relationship(
        "Comment",
        primaryjoin="and_(Comment.content_id == foreign(Question.id), Comment.content_type == 'question')",
        backref="question",
        cascade="all, delete-orphan",
        viewonly=True,
        uselist=True,
        lazy=True,
    )
    saves = db.relationship(
        "Save",
        primaryjoin="and_(foreign(Save.content_id) == Question.id, Save.content_type == 'question')",
        cascade="all, delete-orphan",
        viewonly=True,
        uselist=True,
        lazy=True,
    )
    tags = db.relationship("Tag", secondary=question_tags, back_populates="questions")
    votes = db.relationship(
        "Vote",
        primaryjoin="and_(foreign(Vote.content_type) =='question', Vote.content_id == Question.id)",
        cascade="all, delete-orphan",
        viewonly=True,
        lazy=True,
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.set_update("content", "title")

    def __repr__(self):
        return f"Question {self.id}"

    # @ Reference .models/formatting.md for date-format key

    def to_dict(self, homepage=False, detail_page=False):
        if homepage:
            saves = [
                save.to_dict()
                for save in self.saves
                if current_user.is_authenticated and save.user_id == current_user.id
            ]
            status = False
            if saves:
                status = True
            return {
                "id": self.id,
                "user_id": self.user.id,
                "questionSave": status,
                "title": self.title,
                "content": self.content,
                "created_at": self.created_at_long_suffix,
                "updated_at": self.updated_at_long_suffix,
                "total_score": self.total_score,
                "num_answers": len(self.answers),
                "num_votes": len(self.votes),
                "User": self.user.to_dict_basic_info(),
                "Tags": [tag.to_dict() for tag in self.tags],
            }
        elif detail_page:
            saves = [
                save.to_dict()
                for save in self.saves
                if current_user.is_authenticated and save.user_id == current_user.id
            ]
            status = False
            if saves:
                status = True
            return {
                "id": self.id,



                "questionSave": status,
                "title": self.title,
                "content": self.content,
                "created_at": self.created_at_long_suffix,
                "updated_at": self.created_at_long_suffix,
                "total_score": self.total_score,
                "num_votes": len(self.votes),
                "num_answers": len(self.answers),
                "Tags": [tag.to_dict() for tag in self.tags],
                "Votes": [
                    vote.to_dict()
                    for vote in self.votes
                    if current_user.is_authenticated and vote.user_id == current_user.id
                ],
                "QuestionUser": self.user.to_dict_basic_info(),
                "Comments": [
                    comment.for_question_detail() for comment in self.comments
                ],
                "Answers": [answer.for_question_detail() for answer in self.answers],
            }
        return {
            "id": self.id,
            "user_id": self.user.id,
            "title": self.title,
            "content": self.content,
            "created_at": self.created_at_long_suffix,
            "updated_at": self.updated_at_long_suffix,
            "total_score": self.total_score,
            "User": self.user.to_dict(),
            "Answers": [answer.to_dict() for answer in self.answers],
            "Comments": [comment.to_dict() for comment in self.comments],
            "Saves": [save.to_dict() for save in self.saves],
            "Tags": [tag.to_dict() for tag in self.tags],
        }
