from flask.ext import restful
from flask import request, g
from app.main.Models import db, Translation, User, Vote
from flask.ext.restful import Resource, reqparse, fields, marshal_with

from pprint import pprint
from flask.ext.restful import reqparse
import json




vote_fields = {
    "id": fields.Integer(attribute='id'),
    "uid": fields.Integer(attribute='id'),
    "value": fields.Integer
}

class VoteService(restful.Resource):
    
    @marshal_with(vote_fields)
    def post(self, translation = None):
        jsonData = json.loads(request.form['data'])
        vote = None 
        if not hasattr(jsonData, 'id'):
            vote = Vote(jsonData['translation'], g.user)
        #persist
        db.session.add(vote)
        db.session.commit()
        
        return vote
        
    def increment_vote(translationID):
        translation = db.query(Translation).get(translationID)
        translation.incrementVote()
        db.session.commit()
        