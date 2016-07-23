from app import app
import os

if __name__ == "__main__":
    
    env = "dev" if os.name == "nt" else "prod"    
    app.run("192.168.1.4", debug=True)