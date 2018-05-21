from flask import request, g
from app.main.Models import Metadata, UserAlertMetadata
from flask_restful import Resource, reqparse, fields, marshal_with

from app import db
import json


class AlertService(Resource):
	
	#/rest/alert/translation
	def get(self, data_type, data_id):
		count = Metadata.count_by('alert', target=data_type + ":" + str(data_id))
		target = data_type + ":" + str(data_id)
		response = {"key":"alert", "target": target, "count": count}
		return response
	
	#/rest/alert/translation
	def post(self, data_type, data_id):
		#key:value#
		target = data_type + ":" + str(data_id)
		#count uservote
		user_has_voted = Metadata.count_by('user-alert', value=g.user.id, target=target)
		if user_has_voted:
			return

		jsonData = json.loads(request.form['data'])
		alert_metadata = Metadata(key=jsonData['key'], value=jsonData['value'])
		alert_metadata.set_target(target)
		db.session.add(alert_metadata)
		
		#handle the user
		user_alert = UserAlertMetadata(g.user.id, target)
		db.session.add(user_alert)
		db.session.commit()
