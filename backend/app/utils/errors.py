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

class ExistenceError(Exception):
    def __init__(self, message="Existence Error", errors=None):
        super().__init__(message)
        self.message = message
        self.errors = errors or []

    def to_dict(self):
        error_response = {
            "message": self.message,
            "errors": [{"field": field, "message": msg} for field, msg in self.errors],
            # "errors": [{"message": msg} for msg in self.errors],
        }
        return error_response

class AuthorizationError(Exception):
    def __init__(self, resource, message="Authorization Error"):
        super().__init__(message)
        self.message = message
        self.resource = resource

    def to_dict(self):
        error_response = {
            "message": self.message,
            "error": f"Forbidden, not the owner of this {self.resource}"
        }
        return error_response
    
class AuthenticationError(Exception):
    def __init__(self, message=""):
        super().__init__(message)
        self.message = message

    def to_dict(self):
        error_response = {
            "message": "Authorization Error",
            "error": f"{self.message}"
        }
        return error_response