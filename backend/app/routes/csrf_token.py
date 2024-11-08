# from flask_wtf.csrf import generate_csrf
# from flask import Blueprint, jsonify, make_response

# bp = Blueprint("csrf_token", __name__, url_prefix="/api/csrf")


# @bp.route("/", methods=["GET"])
# def get_csrf():
#     csrf_string = generate_csrf()
#     res = make_response("Setting the cookie")
#     res.set_cookie("X-CSRF-Token", csrf_string, path="/")
#     return res
#     # return jsonify(csrfToken=generate_csrf())
