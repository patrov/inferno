import click
from flask import Flask
from pprint import pprint
from app import app
from app import db
from _mysql_exceptions import OperationalError
import re
import os
import subprocess
import getpass

@app.cli.command()
def initdb():
	"""create the inferno database"""
	try:
		# create db
		click.echo("...Installation de la base de donnée.")
		db.create_all()
		click.echo("...Installation de la base Inferno réussie.")
		click.echo("...Installation d'Inferno")
		populate_data()
		click.echo("...Installation d'Inferno réussie.")

	except OperationalError as e:
		pattern = re.compile('1049s')
		match = pattern.search(str(e))
		if not match :
			"La base inferno n'existe pas!"

	except Exception as e:
		print(e)

def create_database(db_name=None):
	session = db.session()
	session.execute("CREATE DATABASE IF NOT EXISTS {0};".format(db_name))
	session.commit()

def populate_data():
	"""Import the data"""
	try:
		data_path = os.path.join(app.root_path, 'data', 'inferno.sql')
		user = input("user> ")
		cmd = "mysql -u {0} -p inferno < {1}".format(user, data_path)
		proc = subprocess.Popen(cmd, shell=True)
		proc.communicate() # make process communication
	except Exception as e:
		raise(e)