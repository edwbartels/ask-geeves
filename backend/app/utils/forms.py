from flask_wtf import FlaskForm
from wtforms.fields import PasswordField,StringField, SubmitField
from wtforms.validators import DataRequired


class LoginForm(FlaskForm):
    username = StringField("username", [DataRequired()])
    password = PasswordField("password", [DataRequired()])
    submit = SubmitField("Login")