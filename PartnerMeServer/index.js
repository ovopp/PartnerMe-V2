const express = require('express');
const request = require('request');
const func = require('./functions');
const app = express();
const PORT = 3000;
const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const client = new MongoClient(uri);
client.connect();

// databasesList = await client.db().admin().listDatabases();


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


const { Connection, Request } = require("tedious");
const { InsufficientStorage } = require('http-errors');

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "partnermeteam",
      password: "df67POIL!#"
    },
    type: "default"
  },
  server: "partnerme.database.windows.net",
  options: {
    database: "PartnerMe",
    encrypt: true,
    rowCollectionOnRequestCompletion: true
  }
};

app.use(express.json());
const connection = new Connection(config);
/**
 * hello
 * simple endpoint to run SQL scripts to change DB
 */
app.get('/dbproxy' , (request, response)=>{
  // const connection = new Connection(config);
  // var reqString = `DELETE FROM test WHERE email = 'vincentyan8@gmail.com'`;
  connection.on("connect", err => {
    if (err) {
      console.log("error");
      console.error(err.message);
    }
    else {
      const sqlreq = new Request(
        reqString, 
        (err, rowCount) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log("success");
            connection.close();
          }
        }
      );
      connection.execSql(sqlreq);
    }
  });
});


app.get('/', (request, response) => {
    response.send('Hello');
});

// USER METHODS

app.post('/user/update', (request, response)=>{
  if(request.body.name == undefined || request.body.class == undefined || request.body.language == undefined || request.body.availability == undefined || request.body.hobbies == undefined || request.body.email == undefined){
    response.send({"message": "Cannot update user because the request body is undefined"}, 400);
  }
  else{
  const connection = new Connection(config);
  var reqString = `UPDATE test SET name = '${request.body.name}' , language = '${request.body.language}', 
  class = '${request.body.class}', availability = '${request.body.availability}', hobbies = '${request.body.hobbies}' WHERE email = '${request.body.email}'`;
  connection.on("connect", err => {
    if (err) {
      console.log("error");
      console.error(err.message);
    }
    else {
      const sqlreq = new Request(
        reqString, 
        (err, rowCount) => {
          if (err) {
            console.error(err.message);
            response.send({"error" : "Update user failed. SQL connection to database failed to complete"}, 400);
          } else {
            console.log("success");
            response.send({"success" : true});
            connection.close();
          }
        }
      );
      connection.execSql(sqlreq);
    }
  });
}
});



app.post('/user/current-user', (request,response)=>{
  if(request.body.email == undefined){
    response.send({"message": "Request query is invalid for current user"}, 400);
  }
  else{
  const connection = new Connection(config);
  var reqString = `SELECT * FROM test WHERE email = '${request.body.email}'`;
  connection.on("connect", err => {
    if (err) {
      console.log("error");
      console.error(err.message);
    }
    else {
      const sqlreq = new Request(
        reqString, 
        (err, rowCount, rows) => {
          if (err) {
            console.error(err.message);
            response.send(err, 400);
            connection.close();
          } else {
            if (rowCount != 0){
              response.send({"error" : "No user found, please resign-in and register"} , 400);
            }
            var item = {
              "Name" : rows[0][0].value ,
              "Class" : rows[0][1].value ,
              "Language" : rows[0][2].value,
              "Availability" : rows[0][3].value,
              "Hobbies" : rows[0][4].value,
              "Email" : rows[0][5].value
              };
              response.send({"user": item});
            connection.close();
          }
        }
      );
      connection.execSql(sqlreq);
    }
  });
}
});

//////// AUTH SERVICE ////////

app.post('/auth/check', (request, response)=>{
    // check with fb / google auth
    if(request.body.email == undefined){
      response.send({"message": "No email provided for authentication"}, 400);
    }
    else{
    const connection = new Connection(config);
    var reqString = `SELECT * FROM test WHERE email = '${request.body.email}'`;
    connection.on("connect", err => {
      if (err) {
        console.log("error");
        console.error(err.message);
      }
      else {
        const sqlreq = new Request(
          reqString, 
          (err, rowCount) => {
            if (err) {
              console.error(err.message);
            } else {
              if(rowCount !== 0){
                response.send({"success" : true});
              }
              else{
                response.send({"error" : "No user found with that email"}, 400);
              }
              connection.close();
            }
          }
        );
        connection.execSql(sqlreq);
      }
    });
  }
});

app.post('/auth/create', (request, response)=>{
    // check is user_id is already in db, return error
    // connect to auth db and update with user_id and password
    if(request.body.name == undefined || request.body.class == undefined || request.body.language == undefined || request.body.availability == undefined || request.body.hobbies == undefined || request.body.email == undefined){
      response.send({"message": "Create new user failed due to request fields not being valid"}, 400);
    }
    else{
    const connection = new Connection(config);
    var reqString = `INSERT INTO test (name, class, language, availability, hobbies, email) VALUES('${request.body.name}', '${request.body.class}', '${request.body.language}','${request.body.availability}', '${request.body.hobbies}', '${request.body.email}')`;
    connection.on("connect", err => {
      if (err) {
        console.log("error");
        console.error(err.message);
      }
      else {
        const sqlreq = new Request(
          reqString, 
          (err, rowCount, rows) => {
            if (err) {
              console.error(err.message);
              response.send({"error" : "User was not created due to error with connection to database"}, 400);
            } else {
              response.send({"success": true});
              connection.close();
            }
          }
        );
        connection.execSql(sqlreq);
      }
    });
  }
});

// Matching Service

/**
 * TODO: change the request.body.Name to a unique identifier for the user class
 * TODO: add cosine sim to sort and add limit thresholds
 * 
 * gets matches based request body name and class.
 * 
 */
app.post('/matching/getmatch', (req, response) => {
  if(req.body.email == undefined){
    response.send({"message": "User email parameter is invalid for matching"}, 400);
  }
  else{
    var reqString =  `SELECT * FROM test WHERE class IN ( SELECT class FROM test WHERE email = '${req.body.email}')`;
    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", err => {
      if (err) {
          console.log("error");
          console.error(err.message);
      } 
      else {
          response.send(func.cosineSim(connection, req, reqString))
      }   
    });
  }
});

/**
 * Adds a selected user to the current user's
 * list of matched users. 
 */
app.post('/matching/select', (req, res) => {
  if(req.body.email == undefined || req.body.otheremail == undefined){
    this.response.send({"message": "User parameter does not exist"}, 400);
  }
  else {
    var listOfMatches;
    var otherUser;
    var reqString =  `SELECT * FROM test WHERE email = '${req.body.email}'`;
    var reqString2 = `SELECT * FROM match WHERE email = '${req.body.otheremail}'`;
    connection.on("connect", err => {
      if (err) {
        console.log("error");
        console.error(err.message);
      } 
      else {
        const sqlreq = new Request(reqString, (err, rowCount, rows) => {
          if (err) {
            console.log("error");
            console.error(err.message);
          }
          else {
            listOfMatches = rows[0][0];
          }
        });
        const sqlreq2 = new Request(reqString2, (err, rowCount, rows) => {
          if (err) {
            console.log("error");
            console.error(err.message);
          }
          else {
            otherUser = rows[0];
          }
        });
        connection.execSql(sqlreq);
        connection.execSql(sqlreq2);
        
        var reqString3 = `UPDATE match SET list = '${listOfMatches}'`;
        const sqlreq3 = new Request(reqString3, (err, rowCount, rows) => {
          if (err) {
            console.log("error");
            console.error(err.message);
          }
          else {
            listOfMatches = rows[0];
          }
        });

        // var otherUserList = return_user_list[i].Hobbies.split(", "); to split the users
        connection.execSql(sqlreq3);
        res.send({"list-of-matches": listOfMatches});
      }
    });
  }
});

/**
 * 
 */

app.post('/matching/get-match-list', (req, response) => {
  if(req.body.email == undefined){
    this.response.send({"message": "Error, request parameter for match list does not exist"}, 400);
  }
  else{
    var reqString = `SELECT * FROM match WHERE email = '${req.body.email}'`;
    const sqlreq = new Request(reqString, (err, rowCount, rows)=>{
      if(err){
        console.log("error");
        console.error(err.message);
      }
      else {
        rows[0]
      }
    });
  }
});


/**
 * A method to obtain a chat from the database. This is 
 */
app.post('/messages/getchat', (req,response)=>{
  if(req.body.otherUser == undefined || req.body.currentUser == undefined){
    response.send("Cannot obtain chatlog from other user due to undefined request parameters" , 400);
  }
  var names = [req.body.otherUser, req.body.currentUser];
  names.sort(); // We want to sort the names so that user 1 and user 2 is defined alphabetically
  var messagedb = client.db("partnerme").collection('chat');

  setTimeout(function() {
    // Fetch the document that we modified
    messagedb.findOne({'user1' : names[0], 'user2' : names[1]}, function(err, item) {
      item.chatlog.forEach(element => {
        console.log(element.name);
        console.log(element.message);
      });
      response.send(item.chatlog);
    });
  }, 100);
});

/**
 * Main method to handle sending messages. If a user has not chatted with the other user, then
 * a new chatlog would be created betwene the two users.
 */
app.post('/messages/sendmessage', (req, response)=>{
  if(req.body.otherUser == undefined || req.body.currentUser == undefined || req.body.message == undefined){
    response.send("Message to the other user did not complete due to undefined request parameters" , 400);
  }
  var names = [req.body.otherUser, req.body.currentUser];
  names.sort(); // We want to sort the names so that user 1 and user 2 is defined alphabetically
  var messagedb = client.db("partnerme").collection('chat');
  setTimeout(function() {
    // Fetch the document that we modified
    messagedb.findOne({'user1' : names[0], 'user2' : names[1]}, function(err, item){
      if(item == undefined){
        messagedb.insertOne({chat_id : 1,
          user1 : names[0],
          user2 : names[1],
          chatlog : [{name:  req.body.currentUser, message: req.body.message}]},
           function(err, item) {
          if (err) throw err;
          console.log("1 document inserted");
          response.send("1 document inserted", 200);
        });
      }
      else{
        var chatLog = item.chatlog;
        console.log(chatLog);
        var message = {
          'name' : req.body.currentUser,
          'message' : req.body.message
        }
        chatLog.push(message);
        var update = { $set: {'chatlog': chatLog}};
        messagedb.findOneAndUpdate({'user1' : names[0], 'user2' : names[1]}, update, function(err,result){
          if (err) throw err;
          console.log("chatlog updated");
          response.send(chatLog, 200);
        })
      }
    })
  }, 1000);
});

// Collaboration Service
app.post('/collaboration/schedule', (request, response)=>{
    response.send('matching services');
});

app.use(express.urlencoded({
    extended: true
}));

module.exports = app;