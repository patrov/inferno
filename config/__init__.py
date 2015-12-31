import os

def getConfig():
	env = "dev" if os.name == "nt" else "prod"    
	
	if env == "dev":
		from config.config_dev import DevConfig as DevConfig
		return DevConfig
	else:
		from config.config_prod import ProdConfig as ProdConfig
		return ProdConfig
	
