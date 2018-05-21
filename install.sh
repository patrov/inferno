#!/bin/bash

VIRTUAL_ENV_NAME="inferno_env"

function create_virtualenv() {
	echo "Creating virtual env..."
	python3 -m venv $VIRTUAL_ENV_NAME
	echo "activating virtual env"
	source ./$VIRTUAL_ENV_NAME/bin/activate

	return 0
}

function install_dependencies() {
	echo "Installing Dependencies..."
	sudo apt-get install python3-dev libmysqlclient-dev
	sudo apt-get install build-essential libssl-dev libffi-dev
	pip install flask
	pip install Flask-SQLAlchemy
	pip install Flask-Babel
	pip install Flask-Restful
	pip install Flask-Login
	pip install Flask-User==0.6.*
	pip install mysqlclient
	return 0
}

create_virtualenv;

return_code=$?

if [ $return_code -eq 0 ]; then echo "Virtual env created."; fi


install_dependencies;

echo "installing done!"