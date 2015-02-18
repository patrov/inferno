#! python
# -*- coding:utf-8 -*-
from flask import Flask, session, request, g, redirect, abort, url_for, render_template
from rest.TerzaService import TerzaService, TranslationService, CantoService
from auth.AuthManager import login_manager, handle_authentification
from flask.ext import restful
from flask.ext.login import login_user, current_user, login_required
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

@app.route('/')
def index():
	return render_template("inferno.html")

@app.route('/admin')
@login_required
def admin():
    return render_template("admin.html")

@app.route('/login', methods=['POST','GET'])
def login():
    if g.user is not None and g.user.is_authenticated():
        return redirect(request.values.get('next'))
    user = handle_authentification(request.form.get('login'), request.form.get('pass'))
    return render_template("auth.login.html")


@app.before_request
def before_request():
    g.user = current_user


if __name__ == '__main__':
	app.run(debug=True)