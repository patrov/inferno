from flask.ext import restful
from flask import request, g
from app.main.Models import db, Terza, Translation, User, Comment
from flask.ext.restful import Resource, reqparse, fields, marshal_with

from pprint import pprint
from flask.ext.restful import reqparse
import json


class StatService(restful.Resource):
    
    available_services = {'terza' : None, 'user': None, 'comment': None}
    
    
    def getModel(self, name):
        try :
            if name == 'terza':
                StatService.available_services['terza'] = Terza
            
            if name == 'user':
                StatService.available_services['user'] = User
            
            if name == 'comment':
                StatService.available_services['comment'] = Comment
            
            return StatService.available_services[name]

            
        except KeyError, e:
            return restful.abort(404, msg=e) 
            
        
    def get(self, content_type, id):
        
        model = self.getModel(content_type)
        if model :
            stats = model.get_stats(id)  
            return stats
        else:
            restful.abort(400, msg="Bad request exception") 
        
        
        

      