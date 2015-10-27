from flask import Blueprint, request, render_template, g, session, redirect, url_for

from pprint import pprint
import os    
os.environ['LD_LIBRARY_PATH'] = 'my_path'
    
main_app = Blueprint("main", __name__, template_folder = "/templates")

@main_app.route("/app")
def index():
    return render_template('inferno.html')
    

@main_app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404