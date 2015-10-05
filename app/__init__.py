from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@localhost/inferno'
db = SQLAlchemy(app)

from pprint import pprint
from main.main_app import main_app
from rest import mod_api

app.register_blueprint(main_app, url_prefix='/radical')
app.register_blueprint(mod_api)