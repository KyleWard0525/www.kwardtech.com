"""
This file contains the app routes for flask

kward
"""

import uuid                                 #   For unique user IDs
from flask import request                   #   For communicating with the front end
from backend import app                     #   Import flask app

# Initialize user object
user = {
    'id': '',               # User ID
    'failed': False,        # Has the user failed the game
    
    # Selected file
    'file': {
        'name': '',
        'data': '',
        'type': ''
    } 
}

@app.route("/test", methods=["POST"])
def test():
    
    # Get data pass from front end
    data = request.get_json(force=True)

    print("\nData from frontend: " + str(data))

    # Modify data
    result = data['value'] + 1

    # Return to the frontend
    return {"result": result}
