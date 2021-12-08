"""
This file contains the app routes for flask

kward
"""
import json
from flask import request
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
    user['ip'] = data['ip']

    # Check if user already exists
    if db_help.user_exists(user["ip"]):
        return {"result": 0}

    # Attempt to add user to the database
    if(db_help.add_user(user)):
        return {"result": 1}
    else:
        return {"result": 0}

# Save file selected by user
@app.route("/save_file", methods=["POST"])
def save_file():
    # Get data pass from front end
    data = request.get_json(force=True)

    user_ip = data['ip']

    print(f"\nData from frontend\n\tUSER IP: {user_ip}\n\tFILE: {data['file']}")
    
    # Ensure user is in the database
    if db_help.user_exists(user_ip):
        # Update user's file attributes
        db_help.update_user_attr(user_ip, 'file', data['file'])

        return {"result": 1}
    else:
        print(f"\nERROR in save_file(): User with ip '{user_ip}' not found")

        return {"result": 0}