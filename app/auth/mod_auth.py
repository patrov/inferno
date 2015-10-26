from flask import Blueprint, g, request, render_template, redirect, url_for
from flask.ext import restful
from pprint import pprint
from app.main.Models import User
from app import app, db
from flask.ext.login import logout_user, current_user
from app.auth.AuthManager import login_manager, handle_authentification

# handler flask-user
from flask.ext.user import UserManager, login_required, SQLAlchemyAdapter, roles_required

auth_mod = Blueprint("auth", __name__)
login_manager.init_app(app)

# register flask user
db_adapter = SQLAlchemyAdapter(db, User)
user_manager = UserManager(db_adapter, app)

 
@auth_mod.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))   

    
@auth_mod.route('/login', methods=['POST','GET'])
def login():
    if current_user.is_authenticated():
        return redirect(request.values.get('next')  or url_for("index"))
    if  request.values.get('login') is not None:
        user = handle_authentification(request.form.get('login'), request.form.get('pass'))
        return redirect(request.values.get('next')  or url_for("main.index"))
    return render_template("auth.login.html")

    
@auth_mod.route('/user/create', methods=['POST','GET'])    
def create_user():
    return "create user"

# Edit    
@auth_mod.route('/user/edit', methods=['POST','GET'])
@roles_required('admin')
def edit_user():
    return "user edited"

@login_required
@auth_mod.route("/user/members")
def members_page():
    return "members page"
  
    
@app.before_request
def before_request():
    g.user = current_user
    with app.app_context():
        g.user = current_user



 



