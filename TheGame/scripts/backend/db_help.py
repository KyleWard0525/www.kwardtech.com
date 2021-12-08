"""
This file contains helper functions for communicating with the database

kward
"""
import json
from backend import mongo
from bson import ObjectId

# Check if user exists
def user_exists(ip):

    return not (mongo.db.users.find_one({"ip": ip}) == None)

# Attempt to add user to the database
def add_user(user):
    # Check if user already exists
    if not user_exists(user['ip']):
        mongo.db.users.insert_one(user)
        print("\nUSER ADDED\n\n")
        return True
    else:
        print("\nERROR in add_user(): USER ALREADY EXISTS\n")
        return False

# Update user attribute
def update_user_attr(user_ip, attr_name, attr_val):
    if not user_exists(user_ip):
        print("\nERROR in DataBase.add_user_attr(): User with IP Address '" + str(user_ip) + "' not found")
        return False

    # Update user with new attribute
    return mongo.db.users.update_one(
        {'ip': user_ip},
            {
                '$set': {attr_name: attr_val},
                '$currentDate': { 'lastModified': True}
            }
    )