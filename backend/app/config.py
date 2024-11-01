import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    FLASK_ENV = os.environ.get("FLASK_ENV")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///dev.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

