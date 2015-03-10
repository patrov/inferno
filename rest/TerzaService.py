from flask.ext import restful
from flask import request, g
from models.Models import db, Terza, Translation, User
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

translation_fields = {
'id': fields.Integer,
'terza': fields.Nested(terza_fields),
'content': fields.String,
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
        #parser.add_argument('user', type=str, required=True)
        args = parser.parse_args()
        results = Translation.query.filter_by(author=g.user, no_terza=args['terza']).all()
        return results
    
    @marshal_with(translation_fields)
    def post(self):
        """parser = reqparse.RequestParser()
        parser.add_argument('no_terza', type=str, required=True)
        request_params = parser.parse_args()"""
        
        jsonData = json.loads(request.form['data']) 
        terza = Terza.query.filter_by(no_terza=jsonData['terza']).first()
        
        #should be provided by flask
        
        translation = Translation(jsonData['content'], terza, jsonData['state'])
        translation.setAuthor(g.user)
        #persist
        db.session.add(translation)
        db.session.commit()
    
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
        
        
        
        