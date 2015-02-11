from flask import flash
from flask.ext.login import LoginManager, login_user
from models.Models import db, Terza, Translation, User
from pprint import pprint
login_manager = LoginManager()

login_manager.login_view = "login"

@login_manager.user_loader
def load_user(userid):
    pprint(userid)
    return User.query.get(int(userid))
    
    
def handle_authentification(login, password):
    user = User.query.filter_by(login=login, password=password).first()
    pprint("authetification")
    pprint(user)
    if user is not None:
        login_user(user)
    else:
        flash("you are in!")
            

#before request
