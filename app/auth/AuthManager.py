from flask import flash
from flask_login import LoginManager, login_user, current_user

#db & models
from app import db
from app.main.Models import User, AnonymousUser
#from pprint import pprint

login_manager = LoginManager()
login_manager.login_view = "login"

#custom anonymous user  
login_manager.anonymous_user = AnonymousUser

@login_manager.user_loader
def load_user(userid):
    return User.query.get(int(userid))
    
    
def handle_authentification(login, password):
    user = User.query.filter_by(username=login, password=password).first()
    if user is not None:
        login_user(user)
    else:
        flash("you are in!")
            
def load_anonymous_user():
    anonymous_user = User.query.filter_by(username="anonymous").first()
    if anonymous_user is None:
        db.session.add(current_user)    
        db.session.commit()
    return anonymous_user
#before request
