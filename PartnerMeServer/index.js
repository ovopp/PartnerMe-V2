const express = require('express');

const app = express();
const PORT = 3000;
var createError = require('http-errors');
var similarity = require( 'compute-cosine-similarity' );
var logger = require('morgan');

const { Connection, Request } = require("tedious");
const { request } = require('express');

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
const connection = new Connection(config);
app.use(express.json());

/**
 * hello
 * simple endpoint to run SQL scripts to change DB
 */
app.get('/dbproxy' , (request, response)=>{
  const connection = new Connection(config);
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
    response.send('Hello from server');
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
    response.send('Your ID');
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
              response.send({"success" : "User was not created due to error with connection to database"}, 400);
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
  const connection = new Connection(config);
    console.log("connection made");
    var reqString =  `SELECT * FROM test WHERE class IN ( SELECT class FROM test WHERE email = '${req.body.email}')`;
    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", err => {
	if (err) {
	    console.log("error");
	    console.error(err.message);
	} else {
      response.send(cosineSim(req, reqString))
    /*
    const request = new Request(
     reqString,
      (err, rowCount, rows) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
          for(let i = 0 ; i < rows.length ; i++){
            if(req.body.email == rows[i][5].value)
            {
              user_hobby_list = rows[i][4].value.split(", ");
            }
            else{
            var item = {
              "Name" : rows[i][0].value ,
              "Class" : rows[i][1].value ,
              "Language" : rows[i][2].value,
              "Availability" : rows[i][3].value,
              "Hobbies" : rows[i][4].value,
              "Email" : rows[i][5].value
              }
              return_user_list.push(item);
            }
          }
          // connection.close();
          for(let i = 0; i < return_user_list.length ; i++){
            var otherUserList = return_user_list[i].Hobbies.split(", ");
            var userHobbyListTmp = user_hobby_list;
            
            // initialize the dictionaries
            var dictionary = {};
            var tmpdict = {};
            // add keys from the lists to the dictionary
            for(let j = 0; j < otherUserList.length ; j++){
              if(!(otherUserList[j] in dictionary)){
                dictionary[otherUserList[j]] = 0;
                tmpdict[otherUserList[j]] = 0;
              }
            }
            for(let j = 0; j < userHobbyListTmp.length ; j++){
              if(!(userHobbyListTmp[j] in dictionary)){
                dictionary[userHobbyListTmp[j]] = 0;
                tmpdict[userHobbyListTmp[j]] = 0;
              }
            }
            // populate the dictionary to both dicts from the words from the list (vectors)
            for(let j = 0; j < otherUserList.length; j++){
              dictionary[otherUserList[j]] += 1;
            }
            for(let j = 0; j < userHobbyListTmp.length; j++){
              tmpdict[userHobbyListTmp[j]] += 1;
            }
            // empty the lists to be used to hold the values of the dict.
            otherUserList = [];
            userHobbyListTmp = [];
            console.log(dictionary);
            console.log(tmpdict);
            for(const key of Object.keys(dictionary)){
              if(key != undefined){
                otherUserList.push(dictionary[key]);
              }
            }
            for(const key of Object.keys(tmpdict)){
                userHobbyListTmp.push(tmpdict[key]);
            }
            return_list.push({"similarity" : similarity(otherUserList, userHobbyListTmp), "userList": return_user_list[i]});
          }
          return_list.sort(compare);
          response.send({"match result" :return_list});
        }
      }
    );
      connection.execSql(request);
      */
  }
    });
  }
});

function cosineSim(req, reqString){
  var return_list = [];
  var return_user_list = []
  var user_hobby_list = [];
  const request = new Request(
    reqString,
     (err, rowCount, rows) => {
       if (err) {
         console.error(err.message);
       } else {
         console.log(`${rowCount} row(s) returned`);
         if(rowCount == 0){
          return {"match result" : []}
         }
         for(let i = 0 ; i < rows.length ; i++){
           if(req.body.email == rows[i][5].value)
           {
             user_hobby_list = rows[i][4].value.split(", ");
           }
           else{
           var item = {
             "Name" : rows[i][0].value ,
             "Class" : rows[i][1].value ,
             "Language" : rows[i][2].value,
             "Availability" : rows[i][3].value,
             "Hobbies" : rows[i][4].value,
             "Email" : rows[i][5].value
             }
             return_user_list.push(item);
           }
         }
         // connection.close();
         for(let i = 0; i < return_user_list.length ; i++){
           var otherUserList = return_user_list[i].Hobbies.split(", ");
           var userHobbyListTmp = user_hobby_list;
           
           // initialize the dictionaries
           var dictionary = {};
           var tmpdict = {};
           // add keys from the lists to the dictionary
           for(let j = 0; j < otherUserList.length ; j++){
             if(!(otherUserList[j] in dictionary)){
               dictionary[otherUserList[j]] = 0;
               tmpdict[otherUserList[j]] = 0;
             }
           }
           for(let j = 0; j < userHobbyListTmp.length ; j++){
             if(!(userHobbyListTmp[j] in dictionary)){
               dictionary[userHobbyListTmp[j]] = 0;
               tmpdict[userHobbyListTmp[j]] = 0;
             }
           }
           // populate the dictionary to both dicts from the words from the list (vectors)
           for(let j = 0; j < otherUserList.length; j++){
             dictionary[otherUserList[j]] += 1;
           }
           for(let j = 0; j < userHobbyListTmp.length; j++){
             tmpdict[userHobbyListTmp[j]] += 1;
           }
           // empty the lists to be used to hold the values of the dict.
           otherUserList = [];
           userHobbyListTmp = [];
           console.log(dictionary);
           console.log(tmpdict);
           for(const key of Object.keys(dictionary)){
             if(key != undefined){
               otherUserList.push(dictionary[key]);
             }
           }
           for(const key of Object.keys(tmpdict)){
               userHobbyListTmp.push(tmpdict[key]);
           }
           return_list.push({"similarity" : similarity(otherUserList, userHobbyListTmp), "userList": return_user_list[i]});
         }
         return_list.sort(compare);
         // response.send({"match result" :return_list});
       }
     }
   );
    connection.execSql(request);
    return {"match result" :return_list};
}

app.post('/matching/sendmessage', (request, response)=>{
    console.log(request.body);
    response.send("external services");
});

// Collaboration Service
app.post('/collaboration/schedule', (request, response)=>{
    console.log(request.body);
    response.send('matching services');
});

// Error Handling
app.use(function(req,res,next) {
    next(createError(404));
});
app.use(function(err, req, res, next){
    return res.status(err.status || 500);
});


app.use(express.urlencoded({
    extended: true
}));



function test (func) {
    return func(1);
}

module.exports = {test};
// function queryDatabase() {

//   // Read all rows from table
//   const request = new Request(
//     `SELECT * FROM test`,
//     (err, rowCount, rows) => {
//       if (err) {
//         console.error(err.message);
//       } else {
//         console.log(`${rowCount} row(s) returned`);
//         console.log(rows);
//       }
//     }
//   );

//   return request;
// }

function compare( a, b ) {
  if ( a.similarity > b.similarity ){
    return -1;
  }
  if ( a.similarity < b.similarity ){
    return 1;
  }
  return 0;
}

function queryDatabase(query) {

  // Performs the given sql query
  const request = new Request(
    query,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Success: ${rowCount} row(s) returned`);
      }
    }
  );

    connection.execSql(request);
}

function querySelectDatabase(query) {

  // Performs the given sql query
  const request = new Request(
    query,
    (err, rowCount, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Success: ${rowCount} row(s) returned`);
	return rows;
      }
    }
  );

    return connection.execSql(request);
}

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));
