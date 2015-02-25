from flask import flash
from flask.ext.login import LoginManager, login_user
from models.Models import db, Terza, Translation, User, AnonymousUser
from pprint import pprint
login_manager = LoginManager()

login_manager.login_view = "login"

#custom anonymous user  
login_manager.anonymous_user = AnonymousUser

#AnonymousUser

@login_manager.user_loader
def load_user(userid):
    pprint("Ado strange indeed")
    return User.query.get(int(userid))
    
    
def handle_authentification(login, password):
    user = User.query.filter_by(login=login, password=password).first()
    if user is not None:
        login_user(user)
    else:
        flash("you are in!")
            

#before request
