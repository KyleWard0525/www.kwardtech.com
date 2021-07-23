"""
This file contains the class definition for the Crypto class which will be used
for various cryptographic functions
"""
from cryptography.fernet import Fernet
from lockfile import LockFile
import os
import time

class Crypto:

    regenTime = 120                 #   Regenerate a new key every 120 seconds
    keygenTime = 0                  #   Timepoint at which new key was generated
    keyFilename = "cryptkey.key"    #   Crypto key file name

    #   Read encryption key from file. If no file exists, generate a new key
    def readKey(self):
        #   Generate new key
        if not os.path.exists(self.keyFileName):

            return self.newKey()
        
        #   Key already exists
        else:
            #   Open key file and read from file
            keyFile = open(self.keyFilename, "rb")
            key = keyFile.read()
            return

    #   Initialize Crypto class
    def __init__(self):
        self.key = self.readKey()   #   Read/Generate encryption key
        self.checkKeyAge()


    #   Generate new encryption key
    def newKey(self):
        #   Destroy previous key file if it exists
        if os.path.exists(self.keyFilename):
            os.remove(self.keyFilename)
        

        #   Create file to store key
        keyFile = open("cryptkey.key", "wb")

        #   Generate encryption key
        key = Fernet.generate_key()

        #   Save keygen time
        self.keygenTime = time.time()

        #   Write key to file
        keyFile.write(key)

        #   Hide key file
        os.system("attrib +h cryptkey.key")

        return key

    
    #   Check if a new key must be generated
    def checkKeyAge(self):
        end = time.time()
        
        #   Compute elapsed time
        elapsed = end - self.keygenTime

        print("Key age = %.2fs" % elapsed)

        #   Check if new key is needed
        if elapsed >= self.regenTime:
            self.newKey()
            print("Encryption key has been successfully regenerated!")
        else:
            #   Wait for next keygen
            while elapsed < self.regenTime:
                elapsed = time.time() - self.keygenTime
            
            #   Generate new key with recursion
            self.checkKeyAge()


    #   Encrypt data
    def encrypt(self, data):

        #   Create fernet object
        fern = Fernet(self.key)

        #   Encrypt and return data
        return fern.encrypt(data.encode())

    #   Decrypt data
    def decrypt(self, data):
        #  Create fernet object
        fern = Fernet(self.key)

        #   Decrypt and return data
        fern.decrypt(data).decode()


crypt = Crypto()
