from flask import Blueprint, jsonify
from .errors import ValidationError

errors = Blueprint("errors", __name__)


def register_error_handlers(app):
    """
    Register additional custom responses within register_error_handlers function.
    @app.errorhandler(<ErrorClass> or <ErrorCode>)
    Followed by function with handling logic.
    """

    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        response = jsonify(error.to_dict())
        response.status_code = 400
        return response

    """ 
    Current formatting returns status 400 and the following object
    for missing 'content' and 'title' fields in request body
    {
        "message": "Validation Error",
        "errors": [
            {
                "field": "content",
                "message": "Data is required"
            },
            {
                "field": "title",
                "message": "Data is required"
            }
        ]
    }
    """
