from flask.ext import restful
from flask import request, g
from models.Models import db, Terza, Translation, User, Comment
from flask.ext.restful import Resource, reqparse, fields, marshal_with

from pprint import pprint
from flask.ext.restful import reqparse
import json


class StatService(restful.Resource):
    
    def get(self, content_type, id):
        pprint(content_type)
        pprint(id)
        pprint(dir(reqparse))
        
        #lang as parameters
        #parser = reqparse.RequestParser()
        #parser.add_argument('lang', type=str)
        #results = []
        return "ok"
        
        

      