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
    def post(self, no_translation = None, type = 'up'):
        try :
            translation = db.session.query(Translation).get(no_translation)
            vote = Vote.query.filter_by(translation=translation, voter=g.user).first()
            
            if type == 'up':
                if vote is None:
                    vote = Vote(no_translation,  g.user)
                    db.session.add(vote)
                    translation.increment_vote()
                elif vote.value == 0:
                    vote.value = 1
                    translation.increment_vote()                    
                            
            if type == 'down':
                vote = Vote.query.filter_by(translation=translation, voter=g.user).first()
                vote.value = 0
                translation.decrement_vote()
                   
            db.session.commit()
            
        except Exception:
            raise
                
        db.session.commit()
        return vote     
    