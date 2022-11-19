from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

from api.attractions_route import attractions
app.register_blueprint(attractions)

# from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from api.models import db
load_dotenv()
MySQL_password=os.getenv('MySQL_password')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JSON_SORT_KEYS"] = False
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://root:{MySQL_password}@localhost:3306/taipei_day_trip"
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {"pool_pre_ping":True}
# db = SQLAlchemy()
db.init_app(app)

# Pagessql = f'select * from attractions limit 12 offset {skip_row}'
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
#change MySQL passwords
app.run(host='0.0.0.0', port=3000, debug=True)