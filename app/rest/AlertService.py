from flask.ext import restful
from flask import request
from app.main.Models import Metadata
from flask.ext.restful import Resource, reqparse, fields, marshal_with

from app import db
import json


class AlertService(Resource):
	
	#/rest/alert/translation
	def get(self, data_type, data_id):
		count = Metadata.count_by('alert', data_type + ":" + str(data_id))
		target = data_type + ":" + str(data_id)
		response = {"key":"alert", "target": target, "count": count}
		return response
	#/rest/alert/translation
	def post(self, data_type, data_id):
		#key:value#
		jsonData = json.loads(request.form['data'])
		alert_metadata = Metadata(key=jsonData['key'], value=jsonData['value'])
		alert_metadata.set_target(data_type + ":" + str(data_id))
		db.session.add(alert_metadata)
		db.session.commit()
