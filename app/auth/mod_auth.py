from flask import Blueprint, g, request, render_template, redirect, url_for
from flask.ext import restful
from pprint import pprint

from app import app
from flask.ext.login import logout_user, login_required, current_user
from app.auth.AuthManager import login_manager, handle_authentification

auth_mod = Blueprint("auth", __name__)
login_manager.init_app(app)

 
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


@app.before_request
def before_request():
    g.user = current_user
    with app.app_context():
        g.user = current_user
        g.uid = current_user.id



 



