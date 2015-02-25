
from datetime import datetime
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import AnonymousUserMixin


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@localhost/inferno'
db = SQLAlchemy(app)


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
        
    def __repr__(self):
        return '<Terza %r>' % self.no_terza
        

#User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    __mapper_args__ = {'polymorphic_on': login}
        
    def __init__(self, login, password):
        self.login = login
        self.password = password
    
    def is_authenticated(self):
        return True
    
    def is_active(self):
        return True
    
    def is_anonymous(self):
        return False
    
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
        return True
    
    def is_anonymous(self):
        return True
        
    def get_login(self):
        return "anonymous"

        
        
#Translation model
class Translation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    pub_date = db.Column(db.DateTime)
    
    no_terza = db.Column(db.Integer, db.ForeignKey("terza.no_terza"))
    terza = db.relationship('Terza', backref = db.backref('translations', lazy='dynamic'))
    
    state = db.Column(db.Integer)
    vote = db.Column(db.Integer) 
    
    author_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    author = db.relationship('User', backref=db.backref('translations', lazy='dynamic'))
    pub_date = db.Column(db.DateTime)
    update_date = db.Column(db.DateTime)
    
    def __init__(self, content, terza, state=1):
        self.content = content
        self.terza = terza
        self.state = state
        self.pub_date = datetime.utcnow()
        self.update_date = datetime.utcnow();
    
    def setContent(self, content):
        self.content = content
        return self
        
    def setAuthor(self, author):
        self.author = author
        return self
    
    def setState(self, state):
        self.state = state 
        return self
        
    def __repr__(self):
        return "<translation %s>"% self.content
    