import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    FLASK_ENV = os.environ.get("FLASK_ENV")
    REMEMBER_COOKIE_DURATION = timedelta(days=5)
    WTF_CSRF_ENABLED = True
    WTF_CSRF_METHODS = ["POST", "PUT", "DELETE"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevConfig(Config):
    DATABASE_TYPE = os.getenv("DATABASE_TYPE", "sqlite")
    SQLALCHEMY_DATABASE_URI = (
        os.getenv("POSTGRES_URL")
        if DATABASE_TYPE == "postgres"
        else os.getenv("DATABASE_URL", "sqlite:///dev.db")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProdConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("POSTGRES_URL")


config_dict = {"development": DevConfig, "production": ProdConfig}
