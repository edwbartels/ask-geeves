"""
All customizable. Inherits default Exception.
Can look into inheriting other builts in's like HTTPException
Don't think its necessary.
"""


class ValidationError(Exception):
    def __init__(self, message="Validation Error", errors=None):
        super().__init__(message)
        self.message = message
        self.errors = errors or {}

    def to_dict(self):
        error_response = {
            "message": self.message,
            "errors": [{"field": field, "message": msg} for field, msg in self.errors],
        }
        return error_response
