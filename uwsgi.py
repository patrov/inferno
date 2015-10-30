from app import app
import os

test = "Nmae"
if __name__ == "__main__":
    
    env = "dev" if os.name == "nt" else "prod"    
    app.run("0.0.0.0", debug=True)