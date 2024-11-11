from flask import Blueprint, jsonify, request
from sqlalchemy import asc, desc, func, or_, case, and_
import re
from ..models import Question, Tag


bp = Blueprint("search", __name__, url_prefix="/api/search")


@bp.route("/", methods=["GET"])
def get_question_search():
    q = request.args.get("q", "")
    tag_name = request.args.get("tag")

    terms = re.findall(r'"(.*?)"|(\S+)', q)
    search_terms = [term[0] or term[1] for term in terms]

    weight = sum(
        case((Question.title.ilike(f"%{term}%"), 5), else_=0)
        + case((Question.content.ilike(f"%{term}%"), 1), else_=0)
        for term in search_terms
    )
    search_filters = or_(
        *[
            or_(Question.title.ilike(f"%{term}%"), Question.content.ilike(f"%{term}%"))
            for term in search_terms
        ]
    )
    if tag_name:
        search_filters = and_(
            search_filters, Question.tags.any(func.lower(Tag.name) == tag_name)
        )

    search_results = (
        Question.query.filter(search_filters)
        .add_columns(weight.label("weight"))
        .order_by(desc("weight"), desc(Question.total_score), desc(Question.updated_at))
        .all()
    )
    results = [
        {"question": row[0].to_dict(search=True), "weight": row[1]}
        for row in search_results
    ]

    return jsonify(results)
