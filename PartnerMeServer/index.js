const express = require('express');

const app = express();
const PORT = 3000;
var createError = require('http-errors');
var logger = require('morgan');

const mysql = require('mysql');

var con = mysql.createConnection({
    host: "partnerme.database.windows.net",
    user: "partnermeteam",
    password: "df67POIL!#",
    database: "PartnerMe"
});

app.use(express.json());

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


app.post('/auth/external', (request, response)=>{
    // check with fb / google auth
    console.log(request.body);
    response.send("external services");
});

app.post('/auth/create', (request, response)=>{
    // check is user_id is already in db, return error
    // connect to auth db and update with user_id and password
    console.log(request.body);
    response.send("create new account");
});

// Matching Service
app.get('/matching/getmatch', (request, response) => {
    con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	var sql = "SELECT * FROM users";
	con.query(sql, function (err, result, fields) {
	    if (err) throw err;
	    console.log("Got list");
	    response.send(result);
	});
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
