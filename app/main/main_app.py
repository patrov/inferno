# -*- coding: utf-8 -*-
from flask import Blueprint, flash, request, render_template, g, session, redirect, url_for
from pprint import pprint
import os.path
    
main_app = Blueprint("main", __name__, template_folder = "/templates")
from app import app

@main_app.route("/app")
def index():
	description = u"Rejoignez la plateforme de traduction collaborative de Inferno de Dante en créole haïtien"
	description += u". Vini dekouvri yon platfòm ki pèmèt nou tradui en kreyòl ayisyen poèm Dante la Inferno."
	return render_template('inferno.html', meta_description=description, title=" | Tradisksyon")
 

@main_app.route('/')
def home():
    return redirect('/app')

@main_app.route('/about-inferno')
def about():
	description = u"Plus d'infos sur la plateforme de traduction collaborative de Inferno de Dante en créole haïtien"
	description += u". Plis infòmasyon sou platfòm sila a ki pèmèt nou tradui en kreyòl ayisyen poèm Dante la Inferno."
	return render_template('about.html', meta_description=description, title=u" | Projè a"), 404

@main_app.route('/contact')
def contact():
	description = u"Inferno Eksperyans, une expérimentation en digital humanities développé par Harris Baptiste"
	description += u". Inferno Eksperyans, yon eksperyans nan domèn digital humanities ke Harris Baptiste devlope." 
	return render_template("contact.html", meta_description=description, title=" | Kontak Harris Baptiste"), 404

@main_app.route('/user/confirm')
def confirm_action():
	return render_template("confirm_action.html")
	
	
@main_app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

@main_app.before_request
def handle_confirmation():
	pass

