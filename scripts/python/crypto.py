"""
This file contains the class definition for the Crypto class which will be used
for various cryptographic functions
"""
from cryptography.fernet import Fernet
from lockfile import LockFile
import os
import sys
import time
import threading
import random

class Crypto:

    regenTime = 10                  #   Regenerate a new key every 120 seconds
    keygenTime = 0                  #   Timepoint at which new key was generated
    keyFilename = "cryptkey.key"    #   Crypto key file name
    dataEntries = []                #   File location for data that has been encrypted

    #   Read encryption key from file. If no file exists, generate a new key
    def readKey(self):
        #   Generate new key
        if not os.path.exists(self.keyFilename):

            return self.newKey()
        
        #   Key already exists
        else:
            #   Open key file and read from file
            keyFile = open(self.keyFilename, "rb")
            key = keyFile.read()
            return key

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
        keyFile = open(self.keyFilename, "wb")

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

        #   Check if new key is needed
        if elapsed >= self.regenTime:
            self.key = self.newKey()
            
            #   Re-encrypt data with new key
            for data in range(len(self.dataEntries)):
                if type(self.dataEntries[data]) is bytes:
                    self.dataEntries[data] = self.encrypt(self.dataEntries[data])
                else:
                    self.dataEntries[data] = self.encrypt(self.dataEntries[data].encode())
            
            print("\nNew encryption key generated: %s" % self.key)
            print("Data: " + str(self.dataEntries))


    #   Encrypt data
    def encrypt(self, data):

        #   Create fernet object
        fern = Fernet(self.readKey())

        if type(data) is bytes:
            return fern.encrypt(data)
        else:
            #   Save raw data to be reencrypted upon keygen
            self.dataEntries.append(data)
            
            #   Encrypt and return data
            return fern.encrypt(data.encode())

        

    #   Decrypt data
    def decrypt(self, data):
        #  Create fernet object
        fern = Fernet(self.readKey())

        #   Decrypt and return data
        return fern.decrypt(data).decode()


#   Threaded class for measuring elapsed keygen time
class KeyGenThread(threading.Thread):

    def __init__(self, threadID, threadName, objCrypto):
        threading.Thread.__init__(self) #   Initialize threading class
        self.id = threadID
        self.name = threadName
        self.crypto = objCrypto         #   Cryptography object
        

    #   Wait until next keygen
    def run(self):
        while True:

            #   Compute elapsed time
            elapsed = time.time() - self.crypto.keygenTime
            
            #   Wait for next keygen opportunity
            while elapsed < self.crypto.regenTime:
                elapsed = time.time() - self.crypto.keygenTime

            #   Check for keygen opportunity
            self.crypto.checkKeyAge()  



if __name__ == "__main__":
    crypt = Crypto()
    threadKeygen = KeyGenThread(0, "keygen-thread", crypt)
    threadKeygen.start()
    crypt.encrypt("hello")

    while True:
        if random.random() > 0.25:
            for data in crypt.dataEntries:
                print("Decrypted data = %s" % crypt.decrypt(data.encode()))
        else:
            time.sleep(crypt.regenTime/4)


