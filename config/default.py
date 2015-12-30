class InfernoConfig(object):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql://root@localhost/inferno'
    SECRET_KEY = 'fad01349425aab2d3d0a3cc33c538ddb'
    
    # Flask-User
    USER_ENABLE_CHANGE_USERNAME = False
    HOME_ENDPOINT = 'main.index'  
    
    USER_AFTER_LOGIN_ENDPOINT = HOME_ENDPOINT
    USER_AFTER_LOGOUT_ENDPOINT = HOME_ENDPOINT
    USER_AFTER_REGISTER_ENDPOINT = HOME_ENDPOINT
    USER_AFTER_CONFIRM_ENDPOINT = HOME_ENDPOINT
    USER_AFTER_RESET_PASSWORD_ENDPOINT = HOME_ENDPOINT
    
    # Flask-User Email Template
    USER_APP_NAME = 'Inferno Eksperyans' 
                 
    
    # Flask-Mail
    MAIL_PORT = 587
    MAIL_DEFAULT_SENDER = 'inferno.keyoleksperyans@gmail.com'
    MAIL_SERVER = 'smtp.mailgun.org'
    MAIL_USERNAME = 'postmaster@sandbox197b2cead5aa4bd493c86620f1d6bb3b.mailgun.org'
    MAIL_PASSWORD = 'f65aa84cd3d4643360201c938869916a'
    MAIL_USE_TLS = False
    
    #