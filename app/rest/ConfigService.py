from flask.ext import restful
from flask import request, g


class ConfigService(restful.Resource):
    
    def get(self):
        if g.user.id is not None:
            return {'mode':'contrib'}, 200, {'X-Mode': 'contrib'}
        else:
            return {'mode': 'view'}, 200, {'X-Mode': 'view'}

        
        
