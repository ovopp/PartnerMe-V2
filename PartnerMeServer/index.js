const express = require('express');
const request = require('request');
const func = require('./functions');
const app = express();
const PORT = 3000;
var createError = require('http-errors');
var similarity = require( 'compute-cosine-similarity' );
var logger = require('morgan');

const { Connection, Request } = require("tedious");

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
app.get('/auth/getID', (request, response) => {
  // response.send(func.cosineSim());
});


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

app.post('/matching/sendmessage', (request, response)=>{
    response.send("external services");
});

// Collaboration Service
app.post('/collaboration/schedule', (request, response)=>{
    response.send('matching services');
});

app.use(express.urlencoded({
    extended: true
}));

module.exports = app;