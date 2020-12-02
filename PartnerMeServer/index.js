require('events').EventEmitter.prototype._maxListeners = 0;
const express = require('express');
const request = require('request');
const func = require('./functions');
const app = express();


// Connection to mongoDB
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://admin:By9b9736XkUGKcr@partnerme.jv6xf.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const { InsufficientStorage } = require('http-errors');

app.use(express.json());

var admin = require("firebase-admin");
var serviceAccount = require("./firebasekey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-application-5befc.firebaseio.com"
});


/**
 * hello
 * simple endpoint to run SQL scripts to change DB
 */
app.get('/dbproxy' , (request, response)=>{
  var reqString = `SELECT * FROM users`;
            
    func.querySelectDatabase(reqString, function(err, rowCount, rows){
	if (err) {
            console.error(err.message);
	} else {
	    response.send(rows);
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
      var reqString = `UPDATE users SET name = '${request.body.name}' , language = '${request.body.language}', 
  class = '${request.body.class}', availability = '${request.body.availability}', hobbies = '${request.body.hobbies}' WHERE email = '${request.body.email}'`;
      func.queryDatabase(reqString, function(err, rowCount){
	  if (err) {
	      console.error(err.message);
	      response.send({"error" : "Update user failed. SQL connection to database failed to complete"}, 400);
	  } else {
	      response.send({"success" : true});
	  }
      });
  }
});

app.post('/user/updatetoken', (req, response) =>{
	if(req.body.email == undefined || req.body.token == undefined){
		response.send({"message" : "Cannot update user token because the request body is undefined"}, 400);
	}
	else{
		var reqString = `UPDATE users SET token = '${req.body.token}' WHERE email = '${req.body.email}'`;
		func.queryDatabase(reqString, function(err, rowCount){
			if(err){
				console.error(err.message);
	      		response.send({"error" : "Update user failed. SQL connection to database failed to complete"}, 400);
			}
			else{
				response.send({"success": true});
			}
		});
	}

})



app.post('/user/current-user', (request,response)=>{
    if(request.body.email == undefined){
	response.send({"message": "Request query is invalid for current user"}, 400);
    }
    else{
	var reqString = `SELECT * FROM users WHERE email = '${request.body.email}'`;
	func.querySelectDatabase(reqString, function(err, rowCount, rows){
		if (rowCount == 0){
		response.send({"error" : "No user found, please resign-in and register"} , 400);
		}
		var item = {
			"ID" : rows[0][0].value ,
			"Email" : rows[0][1].value ,
			"Name" : rows[0][2].value,
			"Class" : rows[0][3].value,
			"Language" : rows[0][4].value,
			"Availability" : rows[0][5].value,
			"Hobbies" : rows[0][6].value,
			"Token" : rows[0][7].value
		};
		response.send({"user": item});
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
	var reqString = `SELECT * FROM users WHERE email = '${request.body.email}'`;
	func.queryDatabase(reqString, function(err, rowCount){
	    if (err) {
		console.error(err.message);
	    } else {
		if(rowCount !== 0){
		    response.send({"success" : true});
		}
		else{
		    response.send({"success" : false});
		}
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
	var reqString = `INSERT INTO users (name, class, language, availability, hobbies, email) VALUES('${request.body.name}', '${request.body.class}', '${request.body.language}','${request.body.availability}', '${request.body.hobbies}', '${request.body.email}')`;

	func.querySelectDatabase(reqString, function(err, rowCount, rows){
	    if (err) {
		console.error(err);
		response.send({"error" : "User was not created due to error with connection to database"}, 400);
	    } else {
		response.send({"success": true}, 200);
	    }
	});
    }
});

/// Matching Service /// 

/**
 * 
 * Gets matches based request body name and class.
 * This also calls consine similarity function for all users in the table and find similarities between them
 * 
 */
app.post('/matching/getmatch', (req, response) => {
    if(req.body.email == undefined){
	response.send({"message": "User email parameter is invalid for matching"}, 400);
    }
    else{
	var reqString =  `SELECT * FROM users WHERE class IN ( SELECT class FROM users WHERE email = '${req.body.email}')`;
	// Attempt to connect and execute queries if connection goes through
		func.cosineSim(req, reqString, function(result){
			response.send({"match result" : result}, 200);
		});
	};
});

// function removeNoMatchUsers(match_list, user_email){
// 	var nomatchlistdb = client.db("PartnerMe").collection('nomatchlist');
// 	var match_list_pruned = match_list;
// 	console.log(match_list_pruned);
// 	    // Fetch the document that we modified
// 	nomatchlistdb.findOne({'user' : user_email}, function(err, item) {
// 		if(err) throw err;
// 		if(item === undefined){
// 			return match_list_pruned;
// 		}
// 		else{
// 			console.log(match_list_pruned);
// 			item.chatlog.forEach(element => {
// 				for(var i = 0; i < match_list_pruned.length; i++){
// 					if(match_list_pruned[i].userList.Email === element){
// 						match_list_pruned.splice(i,1);
// 						i--;
// 					}
// 				}
// 			});
// 			return match_list_pruned;
// 		}
// 	});
// }


/**
 * Match swipe right
 */
app.post('/matching/swiperight', (req,response)=>{
    if(req.body.currentUser == undefined || req.body.otherUser == undefined || req.body.token == undefined){
	response.send("Cannot obtain matchlist due to undefined request parameters" , 400);
    }
    var matchlistdb = client.db("PartnerMe").collection('matchlist');
    var nomatchlistdb = client.db("PartnerMe").collection('nomatchlist');
    var bool = false;
    setTimeout(function() {
	// Fetch the document that we modified
	matchlistdb.findOne({'user' : req.body.currentUser}, function(err, item) {
	    if(err) throw err;
	    var match_list;
	    if(item == undefined){
		match_list = [{'name' : req.body.otherUser}];
		matchlistdb.insertOne({'user' : req.body.currentUser, 'matchlist' : match_list}, function(err,result){
		    if(err) throw err;
		    console.log("Inserted into Database");
		})
	    }
	    else{
		match_list = item.matchlist;
		/* Check to see if the item already exists */
		item.matchlist.forEach( element => {
		    if(!bool){
			if(req.body.otherUser == element.name){
			    response.send({'success' : 'The user is already in the matchlist'},200);
			    bool = true;
			}
		    }
		});
		if(!bool){
		    /* Updates the current user's matchlist */
		    match_list.push({'name' : req.body.otherUser});
		    var update = { $set: {'matchlist' : match_list}};
		    matchlistdb.findOneAndUpdate({'user' : req.body.currentUser}, update, function(err, result){
			if (err) throw err;
			console.log("chatlog updated");
		    })
		}
	    }
	    /* Updates the current user's nomatchlist (removes them from the pool) */
	    if(!bool){
		nomatchlistdb.findOne({'user': req.body.currentUser}, function(err, item2){
		    if(err) throw err;
		    if(item2 == undefined){
			nomatchlistdb.insertOne(
			    {'user' : req.body.currentUser,
			     nomatchlist : [{name:  req.body.otherUser}]
			    },function(err, item) {
				if (err) throw err;
				console.log("updated current user's nomatch list");
			    })
		    }
		    else{
			var match_list2 = item2.nomatchlist;
			match_list2.push({'name' : req.body.otherUser});
			update = { $set: {'nomatchlist' : match_list2}};
			nomatchlistdb.findOneAndUpdate({'user' : req.body.currentUser}, update, function(err,result2){
			    if (err) throw errl
			    console.log("updated current user's nomatch list");
			})
		    }
		})
	    }
	    if(!bool){
		/* looks into the other user's db to see if the currentUser is matched there */
		matchlistdb.findOne({'user' : req.body.otherUser}, function(err, item){
		    if(err) throw err;
		    if(item == undefined){
			response.send({'success' : "User has not looked through matches, will notify you if matched"} , 200);
		    }
		    else{
			item.matchlist.forEach(element =>{
			    /**
			     * When the user matches with the other user, we gotta update both messagelist
			     */
			    if(element.name == req.body.currentUser){
				var messagelistdb = client.db("PartnerMe").collection('messagelist');
				/* Update the current user's message list */
				messagelistdb.findOne({'user': req.body.currentUser}, function(err, result){
				    if(err) throw err;
				    if(result == undefined){
					messagelistdb.insertOne(
					    {'user': req.body.currentUser, 'messagelist' : [{'name': req.body.otherUser}]},
					    function(err){
						if(err) throw(err)
						console.log("updated messagelist");
					    }
					)
				    }
				    else{
					var messagelist = result.messagelist;
					messagelist.push({'name' : req.body.otherUser});
					update = {
					    $set : {'messagelist' : messagelist}
					}
					messagelistdb.findOneAndUpdate({'user' : req.body.currentUser}, update, function(err, updatereturn){
					    if(err) throw err;
					})
				    }
				})
				/* Update the other user's message list */
				messagelistdb.findOne({'user': req.body.otherUser}, function(err, result){
				    if(err) throw err;
				    if(result == undefined){
					messagelistdb.insertOne(
					    {'user': req.body.otherUser, 'messagelist' : [{'name': req.body.currentUser}]},
					    function(err){
						if(err) throw(err)
						console.log("updated other user messagelist");
					    }
					);
				    }
				    else{
					var messagelist = result.messagelist;
					messagelist.push({'name' : req.body.currentUser});
					update = {
					    $set : {'messagelist' : messagelist}
					}
					messagelistdb.findOneAndUpdate({'user' : req.body.otherUser}, update, function(err, updatereturn){
					    if(err) throw err;
					    console.log("updated current user's message list");
					});
				    }
				})

				var usertoken = req.body.token;

				var payload = {
				  notification: {
					title: "Alert",
					body: "Match was found"
				  }
				};
	
				admin.messaging().sendToDevice(usertoken, payload)
				  .then(function(response) {
					console.log("Successfully sent message:", response);
				  })
				  .catch(function(error) {
					console.log("Error sending message:", error);
				  });

				response.send({'success' : "User was a match! Both updated"} , 200);
				bool = true;
			    }
			});
			if(!bool){
			    response.send({'success' : "User has not matched with you, but when they do you will be notified"} , 200);
			}
		    }
		})
	    }
	});
    }, 1000);
});

/**
 * Match swipe left
 * Updates the nomatchlist database for the current user to contain t
 */
app.post('/matching/swipeleft', (req,response)=>{
    if(req.body.currentUser == undefined || req.body.otherUser == undefined){
	response.send("Cannot update method due to request object not valid");
    }
    else{
	var nomatchlistdb = client.db("PartnerMe").collection("nomatchlist");
	nomatchlistdb.findOne({'user' : req.body.currentUser}, function(err,item){
	    if(err) throw err;
	    if(item == undefined){
		nomatchlistdb.insertOne({'user' : req.body.currentUser, 'nomatchlist' : [{'name' : req.body.otherUser}]}, function(err){
		    if(err) throw err;
		    console.log("Inserted new nomatchlist");
		    response.send({'success' : "Successfully created and updated the nomatchlist for current user"} , 200);
		});
	    }
	    else{
		var nomatchlist = item.nomatchlist;
		nomatchlist.push({'name' : req.body.otherUser});
		var update = {
		    $set : {
			'nomatchlist' : nomatchlist
		    }
		}
		nomatchlistdb.findOneAndUpdate({'user' : req.body.currentUser} , update, function(err){
		    if(err) throw err;
		    console.log("Successfully updated the nomatchlist for current user");
		    response.send({'success' : "Successfully updated the nomatchlist for current user"} , 200);
		});
	    }
	})
    }
});

/// MESSAGES METHODS ///

/**
 * A method to obtain a chat from the database.
 */
app.post('/messages/getchat', (req,response)=>{
    if(req.body.otherUser == undefined || req.body.currentUser == undefined){
	response.send("Cannot obtain chatlog from other user due to undefined request parameters" , 400);
    }
    else{
	var names = [req.body.otherUser, req.body.currentUser];
	names.sort(); // We want to sort the names so that user 1 and user 2 is defined alphabetically
	var messagedb = client.db("PartnerMe").collection('chat');

	setTimeout(function() {
	    // Fetch the document that we modified
	    messagedb.findOne({'user1' : names[0], 'user2' : names[1]}, function(err, item) {
        if(item == undefined){
          response.send({"chatlog":[]},200);
        }
        else{
		item.chatlog.forEach(element => {
		    console.log(element.name);
		    console.log(element.message);
		});
		response.send({"chatlog" : item.chatlog}, 200);
  }
	    });
	}, 100);
    }
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
    var messagedb = client.db("PartnerMe").collection('chat');
    setTimeout(function() {
	// Fetch the document that we modified
	messagedb.findOne({'user1' : names[0], 'user2' : names[1]}, function(err, item){
	    if(err) throw err;
	    if(item == undefined){
		messagedb.insertOne({chat_id : 1,
				     user1 : names[0],
				     user2 : names[1],
				     chatlog : [{name:  req.body.currentUser, message: req.body.message}]},
				    function(err, item) {
					if (err) throw err;
					console.log("1 document inserted");
					response.send({"chatlog": chatlog}, 200);
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
		messagedb.findOneAndUpdate({'user1' : names[0], 'user2' : names[1]}, update, function(err){
		    if (err) throw err;
		    console.log("chatlog updated");
		    response.send({"chatlog": chatLog}, 200);
		})
	    }
	})
    }, 500);
});

app.post('/messages/messagelist', (req,response)=>{
    if(req.body.currentUser == undefined){
	response.send("Cannot obtain messagelist due to undefined request parameters" , 400);
    }
    var messagelistdb = client.db("PartnerMe").collection('messagelist');
    setTimeout(function() {
	// Fetch the document that we modified
	messagelistdb.findOne({'user' : req.body.currentUser}, function(err, item) {
	    if(err) throw err;
	    if(item == undefined){
		response.send([], 200);
	    }
	    else{
		response.send({"listofusers" : item.messagelist}, 200);
	    }
	});
    }, 100);
});


app.post('/messages/nomatchlist', (req,response)=>{
    if(req.body.currentUser == undefined){
	response.send("Cannot obtain nomatchlist due to undefined request parameters" , 400);
    }
    var nomatchlistdb = client.db("PartnerMe").collection('nomatchlist');
    setTimeout(function() {
	// Fetch the document that we modified
	nomatchlistdb.findOne({'user' : req.body.currentUser}, function(err, item) {
	    if(err) throw err;
	    if(item == undefined){
		/* send an empty array when there's no nomatchlist */
		response.send([],200);
	    }
	    else{
		response.send(item.nomatchlist);
	    }
	});
    }, 100);
});


app.use(express.urlencoded({
    extended: true
}));

module.exports = app;
