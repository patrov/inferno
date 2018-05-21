from flask import request, g
from app.main.Models import db, Translation, User, Vote
from flask_restful import Resource, reqparse, fields, marshal_with

from pprint import pprint
import json




vote_fields = {
    "id": fields.Integer(attribute='id'),
    "uid": fields.Integer(attribute='id'),
    "value": fields.Integer
}

class VoteService(Resource):
    
    @marshal_with(vote_fields)
    def post(self, no_translation = None, type = 'up'):
        try :
            translation = db.session.query(Translation).get(no_translation)
            #vote = Vote.query.filter_by(translation=translation, voter=g.user).first()
            if type == 'up':
                self.clear_previous_vote(translation)
                vote = Vote(no_translation,  g.user)
                db.session.add(vote)
                translation.increment_vote()                
                            
            if type == 'down':
                vote = Vote.query.filter_by(translation=translation, voter=g.user).delete()
                translation.decrement_vote()
                               
        except Exception:
            raise
                
        db.session.commit()
        return vote     
    
    def clear_previous_vote(self, current_translation):
        # Previous user vote for the translation
        vote = db.session.query(Vote)\
            .join(Vote.translation)\
            .filter(Vote.voter==g.user)\
            .filter(Translation.terza == current_translation.terza)\
            .first()
        # delete previous
        if vote is not None:
            translation = vote.translation
            translation.decrement_vote()
            db.session.delete(vote)
            db.session.commit()
