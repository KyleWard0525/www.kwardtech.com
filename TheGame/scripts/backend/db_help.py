"""
This file contains helper functions for communicating with the database

kward
"""
import json
from backend import mongo
from bson import ObjectId

# Check if user exists
def user_exists(data):
    print(data)

    return not (mongo.db.users.find_one({"metadata": data}) == None)

# Attempt to add user to the database
def add_user(user):
    # Check if user already exists
    if not user_exists(user['metadata']):
        print("\n\nUSER NOT FOUND\n\n")

        mongo.db.users.insert_one(user)
        return True
    else:
        print("\n\nUSER ALREADY EXISTS\n\n")
        return False