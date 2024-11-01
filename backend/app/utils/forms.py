from flask_wtf import FlaskForm
from wtforms.fields import PasswordField,StringField, SubmitField
from wtforms.validators import DataRequired,Length,Email,EqualTo,ValidationError
from ..models.user import User

class LoginForm(FlaskForm):
    username = StringField("username", [DataRequired()])
    password = PasswordField("password", [DataRequired()])
    submit = SubmitField("Login")

class SignupForm(FlaskForm):
    username = StringField('Username', [DataRequired(), Length(min=1, max=24)])
    email = StringField('Email', [DataRequired(), Email()])
    password = PasswordField('Password', [DataRequired()])
    confirm_password = PasswordField('Confirm Password', [DataRequired(), EqualTo('password', message='Passwords must match')])
    first_name = StringField('First Name', [DataRequired(), Length(min=1,max=100)])
    last_name = StringField('Last Name', [DataRequired(), Length(min=1,max=100)])
    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        user = User.query.filter(User.username == username.data).first()
        if user:
            raise ValidationError('Username is already registered')

    def validate_email(self, email):
        user = User.query.filter(User.email == email.data).first()
        if user:
            raise ValidationError('Email is already registered')