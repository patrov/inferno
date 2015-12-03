from flask import Blueprint, request, render_template, g, session, redirect, url_for
from pprint import pprint
import os.path
    
main_app = Blueprint("main", __name__, template_folder = "/templates")
from app import app
@main_app.route("/app")
def index():
    return render_template('inferno.html')
 
@main_app.route('/static/js/<path:filename>')
def download_file(filename):
     
     path = os.path.join(os.path.sep, app.static_folder, 'js', filename)
     print os.path.isfile(path)
     print path
     return path
     #return app.send_static_file(path)
 

@main_app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404
    