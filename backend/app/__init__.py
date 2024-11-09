import os
from flask import Flask, request, redirect
from .config import config_dict
from flask_login import LoginManager
from .models.db import db
from .models.user import User
from .routes import (
    session,
    user,
    question,
    save,
    tag,
    answer,
    comment,
    vote,
)
from flask_migrate import Migrate
from .seeders.seed_funcs import seed_all, clear_all_data
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_cors import CORS

app = Flask(__name__, static_folder="static", static_url_path="/")
app.json.sort_keys = False  # Prevent flask.jsonify from sorting keys
env = os.getenv("FLASK_ENV", "development")
print("ENV -----> ", env)
if env == "development":
    # Only enable cors if in development
    CORS(app)

config_class = config_dict.get(env, "development")
app.config.from_object(config_class)

db.init_app(app)
# csrf = CSRFProtect(app)

migrate = Migrate(app, db)

# app.register_blueprint(csrf_token.bp)
app.register_blueprint(session.bp)
app.register_blueprint(user.bp)
app.register_blueprint(question.bp)
app.register_blueprint(save.bp)
app.register_blueprint(tag.bp)
app.register_blueprint(answer.bp)
app.register_blueprint(comment.bp)
app.register_blueprint(vote.bp)


#! Starter Repo Template Start
@app.before_request
def https_redirect():
    if os.environ.get("FLASK_ENV") == "production":
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace("http://", "https://", 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        "X-CSRF-Token",
        generate_csrf(),
        secure=True if os.environ.get("FLASK_ENV") == "production" else False,
        samesite="Strict" if os.environ.get("FLASK_ENV") == "production" else None,
        httponly=True,
    )
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]
    route_list = {
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__,
        ]
        for rule in app.url_map.iter_rules()
        if rule.endpoint != "static"
    }
    # print(route_list)
    return route_list


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == "favicon.ico":
        return app.send_from_directory("static", "favicon.ico")
    return app.send_static_file("index.html")


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")


#! Starter Repo Template End

login = LoginManager(app)
login.login_view = "session.login"


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


@app.cli.command("seed")
def seed_all_command():
    # clear_all_data()
    seed_all()
    print("Database seeded")


@app.cli.command("clear-seed")
def clear_all_command():
    clear_all_data()
    print("Seed data removed from database")
