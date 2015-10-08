from datetime import datetime
from flask import Flask, g
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy.orm import column_property, object_session
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import select, func, and_
from flask.ext.login import AnonymousUserMixin
from pprint import pprint
from flask.ext.login import current_user
from app import app, db
from random import random

              
class Terza(db.Model):
    no_terza = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    canto = db.Column(db.Integer)
    lang = db.Column(db.String(4))

    def __init__(self, no_terza, content, canto, lang):
        self.no_terza = no_terza
        self.content = content
        self.canto = canto
        self.lang = lang

    def toJson(self):
        pass
    
    def setContent(self, content):
        self.content = content
    
    @staticmethod
    def get_stats(no_terza):
        response =  {'translation': 0}
        response['translation'] = Translation.query.filter_by(no_terza=no_terza).count()
        return response
        
    
    def __repr__(self):
        return '<Terza %r>' % self.no_terza
        

#User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    #__mapper_args__ = {'polymorphic_on': login}
        
    def __init__(self, login, password):
        self.login = login
        self.password = password
    
    def is_authenticated(self):
        return True
    
    def is_active(self):
        return True
    
    def is_anonymous(self):
        return False
    
    def setEmail(self, email):
        self.email = email
    
    def get_id(self):
        return unicode(self.id)
            
    def __rep__(self):
        return '<User %s id: %r>' % (self.login, self.id)
        
    def __repr__(self):
        return '<User %s id: %r>' % (self.login, self.id) 

class AnonymousUser(AnonymousUserMixin, User):
    __mapper_args__ = {'polymorphic_identity': 'anonymous'}
    
    def __init__(self):
        return None
        
    def is_authenticated(self):
        return False
    
    def is_anonymous(self):
        return True
        
    def get_login(self):
        return "anonymous"

        
 
#Comments
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    pub_date = db.Column(db.DateTime)
    target_id = db.Column(db.Integer, db.ForeignKey("translation.id"))
    target = db.relationship("Translation", backref = db.backref("comments", lazy='dynamic'))
    
    #author
    author_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    author = db.relationship('User', backref=db.backref('comments', lazy='dynamic'))
    
    def __init__(self, content, target_id, author):
        self.content = content
        self.target_id = target_id
        self.author = author
        self.pub_date = datetime.utcnow()

        
       
#vote
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    #translation
    translation_id = db.Column(db.Integer, db.ForeignKey("translation.id"))
    translation = db.relationship('Translation', backref=db.backref('votes', lazy='dynamic'))
    
    #voter
    voter_id = db.Column(db.Integer, db.ForeignKey("user.id")) 
    voter = db.relationship('User', backref=db.backref('votes'))
    
    value = db.Column(db.Integer)
    
    def __init__(self, translation_id, voter, value = 1):
        self.translation_id = translation_id
        self.voter = voter
        self.value = value
    
    def __repr__(self):
        return "<vote voter:%s, translation:%s>" % (self.voter.id, self.translation_id)
    
    
        
#Translation model
class Translation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    pub_date = db.Column(db.DateTime)
    
    no_terza = db.Column(db.Integer, db.ForeignKey("terza.no_terza"))
    canto_id = db.Column(db.Integer)
    terza = db.relationship('Terza', backref = db.backref('translations', lazy='dynamic'))
    
    state = db.Column(db.Integer)
    
    author_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    author = db.relationship('User', backref=db.backref('translations', lazy='dynamic'))
    pub_date = db.Column(db.DateTime)
    update_date = db.Column(db.DateTime)
    comments_count = column_property(select([func.count(Comment.id)]).where(Comment.target_id==id).correlate_except(Comment))
    votes_count = column_property(select([func.count(Vote.id)]).where(Vote.translation_id==id).correlate_except(Vote))
        
    def __init__(self, content, terza, state=1):
        self.content = content
        self.terza = terza
        self.state = state
        self.pub_date = datetime.utcnow()
        self.update_date = datetime.utcnow()
    
    def setContent(self, content):
        self.content = content
        return self
        
    def setAuthor(self, author):
        self.author = author
        return self
    
    @property
    def user_liked(self):
        if hasattr(current_user, 'id'):
            current_user_id = int(current_user.id)
        else:
            current_user_id = 0
        return db.session.query(func.count(Vote.id)).filter(Vote.translation_id == self.id).filter(Vote.voter_id == current_user_id).scalar()
        
    def setState(self, state):
        self.state = state 
        return self
        
    def __repr__(self):
        return "<translation %s>"% self.content

   