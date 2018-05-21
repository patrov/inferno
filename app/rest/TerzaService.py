from flask import request, g
from app.main.Models import Terza, Translation, User, Comment, AlertMetadata
from flask_restful import Resource, reqparse, fields, marshal_with
from app import db
from sqlalchemy import text
from pprint import pprint
import json

terza_fields = {
    'no_terza': fields.Integer,
    'content': fields.String,
    'canto': fields.Integer,
    'lang': fields.String,
}

kreyol_fields = {
    'no_terza': fields.Integer,
    'content': fields.String,
    'canto': fields.Integer(attribute="no_canto"),
    'lang': fields.String(default='kr')
}


author_fields = {
    'login': fields.String(attribute='username')
}

translation_fields = {
    'id': fields.Integer(attribute='id'),
    'content': fields.String,
    'uid': fields.Integer(attribute='id'),
    'author': fields.Nested(author_fields),
    'comments': fields.Integer(attribute='comments_count'),
    'pubdate': fields.DateTime(attribute='pub_date'),
    'votes': fields.Integer(attribute='votes_count'),
    'canto': fields.Integer(attribute='no_canto'), 
    'userLiked': fields.Integer(attribute='user_liked'),
    'alertCount': fields.Integer(attribute='alert_count')
}

comment_fields = {
    'id': fields.Integer(attribute='id'),
    'uid': fields.Integer(attribute='id'),
    'content': fields.String,
    'translation': fields.Nested(translation_fields),
    'author': fields.Nested(author_fields),
    'pubdate': fields.DateTime(attribute='pub_date'),
}


def conditional_marshal(func):
    '''if lang is kr marshal with kreyol'''
    def func_wrap(*args, **kwargs):
        parser = reqparse.RequestParser()
        parser.add_argument('lang', type=str)
        args = parser.parse_args()
        
        wrapped_func = marshal_with(terza_fields)(func)
        
        if hasattr(args, 'lang') and args['lang'] == 'kr':
            wrapped_func = marshal_with(kreyol_fields)(func)
            
        return wrapped_func(*args, **kwargs)
            
    return func_wrap
    

class CantoService(Resource):
    
    @conditional_marshal
    def get(self, canto):
        #lang as parameters
        parser = reqparse.RequestParser()
        parser.add_argument('lang', type=str)
        results = []
        args = parser.parse_args()
        if args['lang'] is not None:
        
            if args['lang'] == 'kr':
                request = 'SELECT * FROM `translation`\
                WHERE no_canto =:no_canto AND \
                vote = (select max(vote) \
                FROM translation as t where t.no_terza = translation.no_terza) \
                ORDER BY translation.no_terza ASC'
                results = Translation.query.from_statement(text(request).params(no_canto=canto)).all()              
            else:
                results = Terza.query.filter_by(canto = canto, lang=args['lang']).all()
        else:
            results = Terza.query.filter_by(canto = canto, lang='it').all()
        
        return results
    
    
    
class TerzaService(Resource):
    
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
class TranslationService(Resource):
    
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
            
        # Don't show content with alerts
        print(type(results))

        return results
    
    def delete(self, no_translation):    
        try:
            translation = Translation.query.get(no_translation)
            db.session.delete(translation)
            db.session.commit()
        except Exception as e:
            msg = e
            print(msg)
        return None , 204
        
    #add pagination after
    def get_contrib_translation(self, terza, filter_ids=[]):
        results = Translation.query.filter_by(no_terza=terza).filter(User.username != g.user.username).all()
        ids = AlertMetadata.get_excluded_contents(max=3, id_only=True)
        results = [translation for translation in results if translation.id not in ids]
        return results
    # not_(User.id.in_([123,456])
    
    @marshal_with(translation_fields)
    def post(self):
           
        jsonData = json.loads(request.form['data']) 
        terza = Terza.query.filter_by(no_terza=jsonData['terza']).first()
        
        #should be provided by flask user hasttr instead
        if jsonData['id'] == 0 :
            translation = Translation(jsonData['content'], terza, jsonData['state'])
            with db.session.no_autoflush:
                translation.setAuthor(g.user)
                translation.setCanto(jsonData['canto'])
        else:
            translation = Translation.query.get(jsonData['id'])
            translation.setContent(jsonData['content'])
            translation.setCanto(terza.canto)
            
        db.session.add(translation)
        db.session.commit()
        return translation
    
 #userService
class UserService(Resource):
    
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
class CommentService(Resource):
    
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