#!/bin/bash
 PYTHONPATH=/home/patrovski/projects/inferno/app

echo "Starting inferno..."
if [ $# -eq 0 ]; then
	export APP_CONFIG_FILE=../config/dev.py
fi

if [ "$1" = "prod" ]; then
	export APP_CONFIG_FILE=../config/prod.py
fi
source ./inferno_env/bin/activate
python3 uwsgi.py
echo "Inferno started!"