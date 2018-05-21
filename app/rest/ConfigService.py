from flask_restful import Resource
from flask import request, g
from pprint import pprint


class ConfigService(Resource):
    
    def get(self):
        if g.user.is_anonymous():
            return {'mode': 'view', "alertMax": 3}, 200, {'X-Mode': 'view'}
        else:
            return {'mode':'contrib', "alertMax": 3}, 200, {'X-Mode': 'contrib'}

        
        
