from flask import Flask
from .config import Config
from flask_login import LoginManager
from .models.db import db
from .models.user import User
from .routes import session
from flask_migrate import Migrate
from .seeders.seed_funcs import seed_all, clear_all_data

app = Flask(__name__)
app.config.from_object(Config)

app.register_blueprint(session.bp)
db.init_app(app)

migrate = Migrate(app, db)


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


"hi there"
