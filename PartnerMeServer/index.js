const express = require('express');

const app = express();
const PORT = 3000;
var createError = require('http-errors');

app.use(express.json());

app.get('/', (request, response) => {
    response.send('Hello');
});

// AUTH SERVICE
app.get('/auth/getID', (request, response) => {
    response.send('Your ID');
});

app.post('/auth/authorize', (request, response)=>{
    console.log(request.body);
    response.send("authorize");
});

app.post('/auth/external', (request, response)=>{
    console.log(request.body);
    response.send("external services");
});

app.post('/auth/create', (request, response)=>{
    console.log(request.body);
    response.send("create new account");
});

// Matching Service
app.get('/matching/getmatch', (request, response) => {
    response.send('Your matches');
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


app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));