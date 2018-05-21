from flask_restful import reqparse, Resource
from flask import request
import json
from app import db
from app.main.Models import Annotation
from pprint import pprint



class AnnotationPositionService(Resource):

    def post(self, no_terza):
        json_data = request.get_json()
        db.session.query(Annotation).\
            filter_by(target = no_terza).\
            update({"position": json.dumps(json_data['position'])})
        db.session.commit()



class AnnotationService(Resource):
    
    def get(self, terza_id=1):
        results = Annotation.query.filter_by(target=terza_id).all()
        json_data = []
        if len(results) != 0:
            json_data = [ result.toJson() for result in results]
            
        return json_data
    
    def delete(self, no_annotation):
        try:
            vote = Annotation.query.filter_by(id=no_annotation).delete()
            db.session.commit()
            return True
        except:
            return False
                    
    def post(self):
        jsonData = request.get_json()
        annotation = Annotation(data=json.dumps(jsonData), target=jsonData['terza'])
        db.session.add(annotation)
        db.session.commit()     
        return annotation.toJson()
        