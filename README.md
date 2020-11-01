# PartnerMe(tm)

Solving the problem of finding the perfect study partner.

# NodeJS
## Testing:
- install latest version of Node
- Download/pull source code
- in folder cmd, do "npm install"
- followed by "npm start"
- A local server should be hosted on http:localhost:3000
- Can test endpoints using android app or POSTMAN

# Android Application
-insert things here-

# Database
- insert methods, setup, testing -

# SQL Database
- Encrypted
- Azure SQL server
## Tables:
- users
  - ID INT NOT NULL
  - name VARCHAR(255)
  - class VARCHAR(255)
  - language VARCHAR(255)
  - availability VARCHAR(255)
  - hobbies NVARCHAR(max)
  - PRIMARY KEY (ID)
- meetings
  - ID INT NOT NULL
  - user1_ID INT
  - user2_ID INT
  - transcript NVARCHAR(max)
  - images NVARCHAR(max)
  - PRIMARY KEY (ID)
  - FOREIGN KEY (user1_ID) REFERENCES users(ID)
  - FOREIGN KEY (user2_ID) REFERENCES users(ID)
- messages
  - ID INT NOT NULL
  - user1_ID INT
  - user2_ID INT
  - date DATETIME
  - message VARCHAR(255)
  - PRIMARY KEY (ID)
  - FOREIGN KEY (user1_ID) REFERENCES users(ID)
  - FOREIGN KEY (user2_ID) REFERENCES users(ID)

Group members:
Vincent Yan
Grady Thompson
Joshua Kim
Daniel Kong
