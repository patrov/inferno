from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

from pprint import pprint
from main.main_app import main_app

app = Flask(__name__)
db = SQLAlchemy(app)
app.register_blueprint(main_app, url_prefix='/radical')