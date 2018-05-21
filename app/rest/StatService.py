from flask import request, g
from app.main.Models import db, Terza, Translation, User, Comment
from flask_restful import Resource, reqparse, fields, marshal_with, abort

from pprint import pprint
import json


class StatService(Resource):
    
    available_services = {'terza' : Terza, 'user': User, 'comment': Comment}
    
    
    def getModel(self, name):
        try :
            return StatService.available_services[name]
            
        except KeyError as e:
            return abort(404, msg=e) 
            
        
    def get(self, content_type, id):
        
        model = self.getModel(content_type)
        if model :
            stats = model.get_stats(id)  
            return stats
        else:
            abort(400, msg="Bad request exception") 
        
        
        

      