from flask import Blueprint

from app import app
from flask_mail import Mail, Message

mail = Mail()
mail.init_app(app)
mail_mod = Blueprint('mail_mod', __name__)


# test mail 
@app.route("/mail/test")
def index():
    msg = Message("Hello 2", sender="harris.baptiste@gmail.com", recipients = ['dpatrov@gmail.com'])
    msg.body = "This is me telling you"
    msg.html = "<p>This is me telling you</p>" 
    mail.send(msg)
    
    