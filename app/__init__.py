from flask import Flask, g
from flask_sqlalchemy import SQLAlchemy
from flask_babel import Babel
from config import getConfig
import jinja2
import os
import os.path
from pprint import pprint

class MyApp(Flask):
    
    def __init__(self):
        Flask.__init__(self, __name__)
        self.jinja_loader = jinja2.ChoiceLoader([
            self.jinja_loader,
            jinja2.PrefixLoader({}, delimiter = ".")
        ])
        
    def create_global_jinja_loader(self):
        return self.jinja_loader

    def register_blueprint(self, bp, url_prefix):
        Flask.register_blueprint(self, bp, url_prefix)
        self.jinja_loader.loaders[1].mapping[bp.name] = bp.jinja_loader
        

#App ROOT        
APP_ROOT = os.path.dirname(os.path.abspath(__file__))   # refers to application_top
APP_ROOT = os.path.abspath(os.path.join(APP_ROOT, os.pardir))

app = Flask(__name__, static_folder=APP_ROOT + '/static', template_folder=APP_ROOT + '/templates')
app.root_path = APP_ROOT 
app.config.from_object(getConfig())

#deal with babel localization here
babel = Babel(app)
app.secret_key = 'thisismyverystrongsecret'

@babel.localeselector
def get_local():
	user = getattr(g, 'user', None)
	if user is not None:
		local = getattr(user, 'local', None)
	if local is not None:
		return local
	else:
		return 'fr'
		
		




# load prod settings
db = SQLAlchemy(app)

from main.main_app import main_app
from rest import api_mod
from auth.mod_auth import auth_mod
from mail import mail_mod
app.register_blueprint(main_app)
app.register_blueprint(api_mod)
app.register_blueprint(mail_mod)

