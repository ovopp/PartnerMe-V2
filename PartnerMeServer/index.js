const express = require('express');

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

/**
 * simple endpoint to run SQL scripts to change DB
 */
app.get('/dbproxy' , (request, response)=>{
  const connection = new Connection(config);
  var reqString = `ALTER TABLE test DROP COLUMN ID`;
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

//////// AUTH SERVICE ////////
app.get('/auth/getID', (request, response) => {
    response.send('Your ID');
});

/**
    {
    "user_id":"hello",
    "password": "password"
    }
*/

app.post('/auth/authorize', (request, response)=>{
    // check user_id and password to make sure hash is correct.
    console.log(request.body);
    response.send("authorize");
});


app.post('/auth/check', (request, response)=>{
    // check with fb / google auth
    console.log(request.body.email);
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
              if(rowCount != 0){
                response.send({"success" : true});
              }
              else{
                response.send({"success" : false});
              }
              connection.close();
            }
          }
        );
        connection.execSql(sqlreq);
      }
    });
});

app.post('/auth/create', (request, response)=>{
    // check is user_id is already in db, return error
    // connect to auth db and update with user_id and password
    const connection = new Connection(config);
    console.log(request.body);
    var reqString = `INSERT INTO test (name, class, language, availability, hobbies) VALUES('${request.body.Name}', '${request.body.Class}', '${request.body.Language}','${request.body.Availability}', '${request.body.Hobbies}')`;
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
            } else {
              response.send("success");
              connection.close();
            }
          }
        );
        connection.execSql(sqlreq);
      }
    });
});

app.post('/auth/getuser', (request, response)=>{
    const connection = new Connection(config);
    // var userName = request.body.Name;
    console.log(request.body.Name);
    var reqString = `SELECT * FROM test WHERE name = '${request.body.Name}'`;
    // var reqString = "INSERT INTO test (name, class, language, availability, hobbies) VALUES ('Vincent Yan', 'CPEN321', 'English', 'Morning', '{[games, sports, dogs]}')";
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
            } else {
              console.log(rows);
              connection.close();
            }
          }
        );
        connection.execSql(sqlreq);
      }
    });
});
var sql = 'INSERT INTO test (name, class, language, availability, hobbies) VALUES (Vincent Yan, CPEN321, English, Morning, {[games,sports,television]})';


// Matching Service

/**
 * TODO: change the request.body.Name to a unique identifier for the user class
 * TODO: add cosine sim to sort and add limit thresholds
 * 
 * gets matches based request body name and class.
 * 
 */
app.post('/matching/getmatch', (request, response) => {
  const connection = new Connection(config);
    console.log("connection made");
    var reqString =  `SELECT * FROM test WHERE class IN ( SELECT class FROM test WHERE Name = '${request.body.Name}')`;
    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", err => {
	if (err) {
	    console.log("error");
	    console.error(err.message);
	} else {
    const request = new Request(
     reqString,
      (err, rowCount, rows) => {
        if (err) {
          console.error(err.message);
        } else {
          var return_list = [];
          console.log(`${rowCount} row(s) returned`);
          for(let i = 0 ; i < rows.length ; i++){
            var item = {
              "Name" : rows[i][0].value ,
              "Class" : rows[i][1].value ,
              "Language" : rows[i][2].value,
              "Availability" : rows[i][3].value,
              "Hobbies" : rows[i][4].value,
              "Email" : rows[i][5].value
            }
            return_list.push(item);
          }
          response.send(return_list);
          connection.close();
        }
      }
    );
      request.on("row", columns => {
        columns.forEach(column => {
          console.log("%s\t%s", column.metadata.colName, column.value);
        });
      });
	    connection.execSql(request);
	}
    });
});

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

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));


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
