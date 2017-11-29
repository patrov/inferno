from flask.ext import restful
from flask import request, g
from app.main.Models import db, Terza, Translation, User, Comment
from flask.ext.restful import Resource, reqparse, fields, marshal_with

from pprint import pprint
from flask.ext.restful import reqparse
import json


class StatService(restful.Resource):
    
    available_services = {'terza' : Terza, 'user': User, 'comment': Comment}
    
    
    def getModel(self, name):
        try :
            return StatService.available_services[name]
            
        except KeyError:
            return restful.abort(404, msg=e) 
            
        
    def get(self, content_type, id):
        
        model = self.getModel(content_type)
        if model :
            stats = model.get_stats(id)  
            return stats
        else:
            restful.abort(400, msg="Bad request exception") 
        
        
        

      