from flask import Flask
from admin.admin import admin
from pprint import pprint 
from flask.ext import restful

# Application
app = Flask(__name__)
app.register_blueprint(admin, url_prefix="/admin/")

#Register service
api = restful.Api(app)
class HelloWorldService(restful.Resource):
    def get(self):
        return {'hello': 'word'}

#register services
api.add_resource(HelloWorldService, '/rest/hello')
#api.add_resource(TerzaService, '/rest/terza')            
@app.route("/")
def home():
    return "Hello World!"
     
if __name__ == "__main__":
    app.run(debug=True)

    