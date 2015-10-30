from flask.ext import restful
from flask import request, g
from pprint import pprint


class ConfigService(restful.Resource):
    
    def get(self):
        if g.user.is_anonymous():
            return {'mode': 'view'}, 200, {'X-Mode': 'view'}
        else:
            return {'mode':'contrib'}, 200, {'X-Mode': 'contrib'}

        
        
