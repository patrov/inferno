from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import jinja2
import os
import os.path

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

print(APP_ROOT)
app = Flask(__name__, static_folder=APP_ROOT + '/static', template_folder=APP_ROOT + '/templates')
app.config.from_object("config.default.InfernoConfig")


# load prod settings
db = SQLAlchemy(app)

from main.main_app import main_app
from rest import api_mod
from auth.mod_auth import auth_mod
app.register_blueprint(main_app)
app.register_blueprint(api_mod)
app.register_blueprint(auth_mod)

