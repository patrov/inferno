from flask import Blueprint, request, render_template, g, session, redirect, url_for

from pprint import pprint
    
main_app = Blueprint("main", __name__)

@main_app.route("/test/")
def index():
    return "Radical test"
    return render_template('text.html')

@main_app.route("/harris")
def harris():
    return "Harris"
    

@main_app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404