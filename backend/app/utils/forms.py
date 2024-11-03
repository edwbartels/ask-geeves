from flask_wtf import FlaskForm
from wtforms.fields import PasswordField,StringField, SubmitField, EmailField
from wtforms.validators import DataRequired


class LoginForm(FlaskForm):
    username = StringField("username", [DataRequired()])
    password = PasswordField("password", [DataRequired()])
    submit = SubmitField("Login")


class SignupForm(FlaskForm):
    firstname = StringField("First Name", [DataRequired()])
    lastname = StringField("Last Name", [DataRequired()])
    email = EmailField("Email", [DataRequired()])
    username = StringField("Username", [DataRequired()])
    password = PasswordField("Password", [DataRequired()])
    submit = SubmitField("Sign Up")