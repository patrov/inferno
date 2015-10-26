from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import jinja2

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
        
   

app = Flask(__name__, static_folder='../static', template_folder='../templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@localhost/inferno'
db = SQLAlchemy(app)
app.secret_key = "fad01349425aab2d3d0a3cc33c538ddb"

from pprint import pprint
from main.main_app import main_app
from rest import api_mod
from auth.mod_auth import auth_mod
app.register_blueprint(main_app)
app.register_blueprint(api_mod)
app.register_blueprint(auth_mod)
