"""
Main driver script for backend
"""
# This lets Python detect backend module
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from backend import app

if __name__ == "__main__":
    app.run(host='0.0.0.0')