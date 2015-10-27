class InfernoConfig(object):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql://root@localhost/inferno'
    SECRET_KEY = 'fad01349425aab2d3d0a3cc33c538ddb'
    
    # Flask-User
    USER_ENABLE_CONFIRM_EMAIL = False
    USER_ENABLE_LOGIN_WITHOUT_CONFIRM = False
    USER_AFTER_LOGIN_ENDPOINT = 'main.index'
    USER_AFTER_LOGOUT_ENDPOINT = 'main.index'
    USER_AFTER_REGISTER_ENDPOINT = 'main.idex'
    
    # Flask-Mail
    MAIL_USERNAME = ''
    MAIL_PASSWORD = ''
    