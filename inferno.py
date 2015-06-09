#! python
# -*- coding:utf-8 -*-
from flask import Flask, session, request, g, redirect, abort, url_for, render_template
from rest.TerzaService import TerzaService, TranslationService, CantoService, UserService, CommentService
from rest.ConfigService import ConfigService
from auth.AuthManager import login_manager, handle_authentification, load_anonymous_user
from flask.ext import restful
from flask.ext.login import login_user, logout_user, login_required, current_user
from pprint import pprint

app = Flask(__name__)
api = restful.Api(app)

#handle login here
login_manager.init_app(app)
app.secret_key = "raidxlblaze"

#register rest services
api.add_resource(CantoService, '/rest/canto/<int:canto>')
api.add_resource(TerzaService, '/rest/terza/<int:no_terza>')
api.add_resource(TranslationService, '/rest/translation')
api.add_resource(CommentService, '/rest/comment')
api.add_resource(UserService, '/rest/user')
api.add_resource(ConfigService, '/rest/config')
#home
@app.route('/index')
#@login_required  
def index():
	return render_template("inferno.html")

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))
    
#backend
@app.route('/admin')
@login_required
def admin():
    return render_template("admin.html")

#login
@app.route('/login', methods=['POST','GET'])
def login():
    if current_user.is_authenticated():
        return redirect(request.values.get('next')  or url_for("index"))
    if  request.values.get('login') is not None:
        user = handle_authentification(request.form.get('login'), request.form.get('pass'))
        return redirect(request.values.get('next')  or url_for("index"))
    pprint(current_user)   
    return render_template("auth.login.html")


@app.before_request
def before_request():
    g.user = current_user
    
if __name__ == '__main__':
	app.run("0.0.0.0", debug=True)