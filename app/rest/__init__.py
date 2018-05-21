from flask import Blueprint
from app.rest.TerzaService import TerzaService, CantoService, TranslationService, CommentService, UserService
from app.rest.ConfigService import ConfigService
from app.rest.VoteService import VoteService
from app.rest.StatService import StatService
from app.rest.AlertService import AlertService
from app.rest.AnnotationService import AnnotationService, AnnotationPositionService

from app import app
from flask_restful import Api

api = Api(app)
api.add_resource(CantoService, '/rest/canto/<int:canto>')
api.add_resource(TerzaService, '/rest/terza/<int:no_terza>')
api.add_resource(CommentService, '/rest/comment')
api.add_resource(UserService, '/rest/user')
api.add_resource(ConfigService, '/rest/config')
api.add_resource(TranslationService, '/rest/translation', endpoint='translation')
api.add_resource(TranslationService, '/rest/translation/<int:no_translation>')
api.add_resource(TranslationService, '/rest/translation/currentuser', endpoint='translationuser')
api.add_resource(VoteService, '/rest/translation/vote/<int:no_translation>/<string:type>')
api.add_resource(StatService, '/rest/stats/<string:content_type>/<int:id>')
api.add_resource(AnnotationPositionService, '/rest/annotations/position/<int:no_terza>')
api.add_resource(AnnotationService, '/rest/annotations', endpoint='annotation')
api.add_resource(AnnotationService, '/rest/annotations/<int:no_annotation>')
#metadata
api.add_resource(AlertService, '/rest/alert/<string:data_type>/<int:data_id>')

api_mod = Blueprint('api', __name__)
