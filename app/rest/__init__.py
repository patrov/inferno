from flask import Blueprint
from app.rest.TerzaService import TerzaService, CantoService, TranslationService, CommentService, UserService
from app.rest.ConfigService import ConfigService
from app.rest.VoteService import VoteService
from app.rest.StatService import StatService

from app import app
from flask.ext import restful

api = restful.Api(app)
api.add_resource(CantoService, '/rest/canto/<int:canto>')
api.add_resource(TerzaService, '/rest/terza/<int:no_terza>')
api.add_resource(TranslationService, '/rest/translation')
api.add_resource(CommentService, '/rest/comment')
api.add_resource(UserService, '/rest/user')
api.add_resource(ConfigService, '/rest/config')
api.add_resource(VoteService, '/rest/vote')
api.add_resource(StatService, '/rest/stats/<string:content_type>/<int:id>')
api_mod = Blueprint('api', __name__)
