from config.default import InfernoConfig as BaseConfig

class DevConfig(BaseConfig):
	
	DEBUG = True
	SQLALCHEMY_DATABASE_URI = 'mysql://root@localhost/inferno'

	
	

