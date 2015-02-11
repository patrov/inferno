from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from datetime import datetime
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/inferno'

db = SQLAlchemy(app)  


#Terza class
class Terza(db.Model):
    id = db.Column(db.Integer)
    canto = db.Column(db.Integer, unique=False)
    content = db.Column(db.Text)
    no_terza = db.Column(db.Integer, primary_key=True)
    lang = db.Column(db.String(4))  

    def __init__(self, canto, content, lang):
        self.canto = canto
        self.content = content
        self.lang = lang
        
    def setNo(self, no):
        self.no_terza = no
        
    def setCanto(self, canto):
        self.canto = canto 
        
    def setContent(self, content):
        self.content = content
 
    def setLang(self, lang):
        self.lang = lang
    
    def __repr__(self):
        return '<Terza %r >' % (self.id)
        
 

#User class
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(10))
    password = db.Column(db.String(10))
    data = db.Column(db.Text)
    
#translation class
class Translation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    no_terza = db.Column(db.Integer, db.ForeignKey('terza.no_terza'))
    terza = db.relationship('Terza', backref = db.backref('translations', lazy='dynamic')) 
    author = db.Column(db.Integer)
    pub_date = db.Column(db.DateTime)
    update_date = db.Column(db.DateTime)
    
    def __init__(self, title, content, terza):
        self.title = self.title
        self.content = self.content
        self.terza = terza
            
        
        
        

    
    
    
    
    

 
