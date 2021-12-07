"""
This file is for creating and configuring the flask app to 
host the backend
"""
from flask.app import Flask                 #   Flask application
from flask_cors import CORS                 #   For a little protection
from flask_pymongo import PyMongo           #   MongoDB with Flask

# Create flask app
app = Flask(__name__)
CORS(app)

# Configure app's database settings
app.config["MONGO_URI"] = "mongodb://localhost:27017/trd"
app.config['MONGO_DBNAME'] = 'the_game'

# Initialize database connection
database = PyMongo(app)

# Add imports for needed modules
import backend.routes