"""
This file contains the app routes for flask

kward
"""
import json
from flask import request                   #   For communicating with the front end
from backend import app                     #   Import flask app
from backend import db_help                 #   DB helper functions

# Initialize user object
user = {
    'failed': False,        # Has the user failed the game
    'file': {},             # Selected file
    'metadata': {}          # User metadata 
}

# App route to test communicating between Flask and AJAX
@app.route("/test", methods=["POST", "GET"])
def test():
    
    # Get data pass from front end
    data = request.get_json(force=True)

    print("\nData from frontend: " + str(data))

    # Modify data
    result = data['value'] + 1

    # Return to the frontend
    return {"result": result}


# Save user's initial  metadata
@app.route("/init_metadata", methods=["POST"])
def init_metadata():
    # Get data pass from front end
    data = request.get_json(force=True)
    

    # Update user
    user['metadata'] = data

    print("\n\nUser: \n" + str(user) + "\n")

    # Attempt to add user to the database
    if(db_help.add_user(user)):
        return {"result": 1}
    else:
        return {"result": 0}


