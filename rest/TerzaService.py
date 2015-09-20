from flask.ext import restful
from flask import request, g
from models.Models import db, Terza, Translation, User, Comment
from flask.ext.restful import Resource, reqparse, fields, marshal_with

from pprint import pprint
from flask.ext.restful import reqparse
import json

terza_fields = {
    'no_terza': fields.Integer,
    'content': fields.String,
    'canto': fields.Integer,
    'lang': fields.String,
}

author_fields = {
    'login': fields.String
}

translation_fields = {
    'id': fields.Integer(attribute='id'),
    'content': fields.String,
    'uid': fields.Integer(attribute='id'),
    'author': fields.Nested(author_fields),
    'comments': fields.Integer(attribute='comments_count'),
    'pubdate': fields.DateTime(attribute='pub_date'),
    'votes': fields.Integer(attribute='votes_count'),
    'userLiked': fields.Integer(attribute='user_liked')
}

comment_fields = {
    'id': fields.Integer(attribute='id'),
    'uid': fields.Integer(attribute='id'),
    'content': fields.String,
    'translation': fields.Nested(translation_fields),
    'author': fields.Nested(author_fields),
    'pubdate': fields.DateTime(attribute='pub_date'),
}


class CantoService(restful.Resource):
    @marshal_with(terza_fields)
    def get(self, canto):
        #lang as parameters
        parser = reqparse.RequestParser()
        parser.add_argument('lang', type=str)
        results = []
        args = parser.parse_args()
        if args['lang'] is not None:
            results = Terza.query.filter_by(canto = canto, lang=args['lang']).all()
        else:
            results = Terza.query.filter_by(canto = canto, lang='it').all()
        
        return results
        
    
class TerzaService(restful.Resource):
    
    def __init__(self): 
        pass
    
    @marshal_with(terza_fields)
    def get(self, no_terza):
        #argument parsing
        parser = reqparse.RequestParser()
        parser.add_argument('lang', type=str)
        args = parser.parse_args()
        if args['lang'] is not None:
            results = Terza.query.filter_by(no_terza = no_terza, lang=args['lang']).first()
        else:
            results = Terza.query.filter_by(no_terza = no_terza).all()
        return results
            
    def put(self): pass
    
    def post(self): pass
    
    def delete(self): pass

#translation service
class TranslationService(restful.Resource):
    
    @marshal_with(translation_fields)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('terza', type=int, required=True)
        parser.add_argument('type', type=str, required=False)
        args = parser.parse_args()
        if args.type is not None :
            results = self.get_contrib_translation(args['terza'])
        else:
            results = Translation.query.filter_by(author=g.user, no_terza=args['terza']).first() #deal with version
        return results
    
    #add pagination after
    def get_contrib_translation(self, terza):
        results = Translation.query.filter_by(no_terza=terza).filter(User.login != g.user.login).all()
        return results
    
    
    @marshal_with(translation_fields)
    def post(self):
        """parser = reqparse.RequestParser()
        parser.add_argument('no_terza', type=str, required=True)
        request_params = parser.parse_args()"""
        
        jsonData = json.loads(request.form['data']) 
        terza = Terza.query.filter_by(no_terza=jsonData['terza']).first()
        
        #should be provided by flask user hasttr instead
        if jsonData['id'] == 0 :
            translation = Translation(jsonData['content'], terza, jsonData['state'])
            translation.setAuthor(g.user)
        else:
            translation = Translation.query.get(jsonData['id'])
            translation.setContent(jsonData['content'])
        #persist
        db.session.add(translation)
        db.session.commit()
        return translation
    
 #userService
class UserService(restful.Resource):
    
    def post(self):
        user =  User.query.filter_by(login=request.form['login']).first()
        if user is None:
            user = User(request.form.get('login'), request.form.get('password'))
            user.setEmail(request.form.get('email'))
            db.session.add(user)
            db.session.commit()
        else:
            return None
        
        
#Comment Service
class CommentService(restful.Resource):
    
    @marshal_with(comment_fields)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('target', type=int, required=True)
        args = parser.parse_args()
        response = []
        if g.user is not None:
            response = Comment.query.filter_by(target_id=args['target'] ).all()
        return response
        
        
    @marshal_with(comment_fields)
    def post(self):
        if g.user is not None:
            jsonData = json.loads(request.form['data']) 
            comment = Comment(jsonData['content'], jsonData['target'], g.user)
            with db.session.no_autoflush:
                db.session.add(comment)
                db.session.commit()
                return comment
        else:
            return None
        #return comment