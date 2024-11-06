import os
from flask import Flask
from .config import config_dict
from flask_login import LoginManager
from .models.db import db
from .models.user import User
from .routes import (
    csrf_token,
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
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS

app = Flask(__name__)
app.json.sort_keys = False  # Prevent flask.jsonify from sorting keys
env = os.getenv("FLASK_ENV", "development")
if env == "development":
    # Only enable cors if in development
    CORS(app)

config_class = config_dict.get(env, "development")
app.config.from_object(config_class)

db.init_app(app)
csrf = CSRFProtect(app)

migrate = Migrate(app, db)

app.register_blueprint(csrf_token.bp)
app.register_blueprint(session.bp)
app.register_blueprint(user.bp)
app.register_blueprint(question.bp)
app.register_blueprint(save.bp)
app.register_blueprint(tag.bp)
app.register_blueprint(answer.bp)
app.register_blueprint(comment.bp)
app.register_blueprint(vote.bp)

login = LoginManager(app)
login.login_view = "session.login"


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


@app.cli.command("seed")
def seed_all_command():
    seed_all()
    print("Database seeded")


@app.cli.command("clear-seed")
def clear_all_command():
    clear_all_data()
    print("Seed data removed from database")
