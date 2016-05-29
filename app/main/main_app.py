from flask import Blueprint, flash, request, render_template, g, session, redirect, url_for
from pprint import pprint
import os.path
    
main_app = Blueprint("main", __name__, template_folder = "/templates")
from app import app

@main_app.route("/app")
def index():
    flash(u"inside my index body", 'infos')
    return render_template('inferno.html')
 

@main_app.route('/')
def home():
    return redirect('/app')
    

	
@main_app.route('/user/confirm')
def confirm_action():
	return render_template("confirm_action.html")
	
	
@main_app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

@main_app.before_request
def handle_confirmation():
	pass

