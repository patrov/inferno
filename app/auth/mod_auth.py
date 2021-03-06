from flask import Blueprint, g, request, render_template, redirect, url_for
from flask.ext import restful
from pprint import pprint
from app.main.Models import User
from app import app, db
from flask.ext.login import logout_user, current_user
from app.auth.AuthManager import login_manager, handle_authentification
from app.auth.validators import inferno_password_validator
# handler flask-user
from flask.ext.user import UserManager, login_required, SQLAlchemyAdapter, roles_required

auth_mod = Blueprint("auth", __name__)

# register flask user
db_adapter = SQLAlchemyAdapter(db, User)

#handle AnonymousUser
user_manager = UserManager(db_adapter, app, password_validator = inferno_password_validator, login_manager = login_manager)

 
@auth_mod.route('/logout')
@login_required
def logout():
    return redirect(url_for("index"))   

    
@auth_mod.route('/login', methods=['POST','GET'])
def login():
    redirect(url_for('user.login'))
    
@auth_mod.route('/user/create', methods=['POST','GET'])    
def create_user():
    return "create user"

# Edit

@auth_mod.route('/user/edit', methods=['POST','GET'])
@roles_required('admin')
def edit_user():
    return "user edited"

@auth_mod.route("/user/members")
@login_required
def members_page():
    return "members page"

@auth_mod.route("/user/anonymous")
def test_member():
    pprint(g.user)
    return "strange"
    
@app.before_request
def before_request():
    g.user = current_user



 



