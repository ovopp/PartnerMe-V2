require('events').EventEmitter.prototype._maxListeners = 0;
const express = require('express');
const func = require('./functions');
const app = express();


// Connection to mongoDB
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:By9b9736XkUGKcr@partnerme.jv6xf.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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


app.get('/', (req, response) => {
	response.send('Hello');
});

// USER METHODS

app.post('/user/update', (req, response) => {
	if (req.body.name == undefined || req.body.class == undefined || req.body.language == undefined || req.body.availability == undefined || req.body.hobbies == undefined || req.body.email == undefined) {
		response.send({ "message": "Cannot update user because the request body is undefined" }, 400);
	}
	else {
		var userDB = client.db("partnermev2").collection("user");
		var update = {
			$set: {
				Name: req.body.name,
				Class: req.body.class,
				Language: req.body.language,
				Availability: req.body.availability,
				Hobbies: req.body.hobbies,
				Email: req.body.email
			}
		}
		userDB.findOneAndUpdate({ Email: req.body.email }, update, function (err) {
			if (err) {
				throw err;
			}
			else {
				response.send({ success: true }, 200);
			}
		});
	}
});


app.post('/user/current-user', (req, response) => {
	if (req.body.email == undefined) {
		response.send({ "message": "Request query is invalid for current user" }, 400);
	}
	else {
		var userDB = client.db("partnermev2").collection("user");
		userDB.findOne({ Email: req.body.email }, function (err, item) {
			if (err) {
				response.send({ "message": err }, 400);
				throw err;
			}
			if (item == undefined) {
				response.send({ "message": "User has not been created, please re-create" }, 400);
			}
			else {
				response.send({ user: item }, 200);
			}
		});
	}
});

//////// AUTH SERVICE ////////

app.post('/auth/check', (req, response) => {
	// check with fb / google auth
	if (req.body.email == undefined) {
		response.send({ "message": "No email provided for authentication" }, 400);
	}
	else {
		var userDB = client.db("partnermev2").collection("user");
		userDB.findOne({ Email: req.body.email }, function (err, item) {
			if (err) {
				throw err;
			}
			if (item == undefined) {
				response.send({ success: false, message: "User has not been created, please re-create" }, 200);
			}
			else {
				response.send({ success: true }, 200);
			}
		});
	}
});

app.post('/auth/create', (req, response) => {
	// check is user_id is already in db, return error
	// connect to auth db and update with user_id and password
	if (req.body.name == undefined || req.body.class == undefined || req.body.language == undefined || req.body.availability == undefined || req.body.hobbies == undefined || req.body.email == undefined) {
		response.send({ "message": "Create new user failed due to request fields not being valid" }, 400);
	}
	else {
		var userDB = client.db("partnermev2").collection("user");
		userDB.findOne({ Email: req.body.email }, function (err, item) {
			if (err) {
				throw err;
			}
			/**
			 * If user does not exist, we have to insert the user into the DB
			 */
			if (item == undefined) {
				userDB.insertOne({
					Name: req.body.name,
					Class: req.body.class,
					Language: req.body.language,
					Availability: req.body.availability,
					Hobbies: req.body.hobbies,
					Email: req.body.email
				}, function (err) {
					if (err) {
						response.send({ "message": "Error occured when creating user" }, 400);
						throw err;
					}
					else {
						response.send({ success: true }, 200)
					}
				});
			}
			else {
				// User was already created
				response.send({ success: true }, 200)
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
	if (req.body.email == undefined) {
		response.send({ "message": "User email parameter is invalid for matching" }, 400);
	}
	else {
		var userDB = client.db("partnermev2").collection("user");
		userDB.find({ Class: req.body.class }).toArray(function (err, item) {
			if (err) {
				throw err;
			}
			else {
				userDB.findOne({ Email : req.body.email }, function(err, currUser){
					if (err) {
						throw err;
					}
					response.send(func.cosineSim(currUser, item));
				});
			}
		});
	}
});


/**
 * Match swipe right
 */
app.post('/matching/swiperight', (req, response) => {
	if (req.body.currentUser == undefined || req.body.otherUser == undefined || req.body.token == undefined) {
		response.send("Cannot obtain matchlist due to undefined request parameters", 400);
	}
	else {
		var usertoken = req.body.token;
		if (usertoken !== null) {
			var payload = {
				notification: {
					title: "Alert",
					body: "Match was found"
				}
			};

			admin.messaging().sendToDevice(usertoken, payload)
				.then(function (response) {
					console.log("Successfully sent message:", response);
				})
				.catch(function (error) {
					console.log("Error sending message:", error);
				});
		}
		var matchlistdb = client.db("partnermev2").collection('match-list');
		var nomatchlistdb = client.db("partnermev2").collection('no-match-list');
		var bool = false;
		setTimeout(function () {
			// Fetch the document that we modified
			matchlistdb.findOne({ 'user': req.body.currentUser }, function (err, item) {
				if (err) {
					throw err;
				}
				var match_list;
				if (item == undefined) {
					match_list = [{ name: req.body.otherUser }];
					matchlistdb.insertOne({ 'user': req.body.currentUser, 'matchlist': match_list }, function (err) {
						if (err) {
							throw err;
						}
					});
				}
				else {
					match_list = item.matchlist;
					/* Check to see if the item already exists */
					item.matchlist.forEach(element => {
						if (!bool) {
							if (req.body.otherUser == element.name) {
								response.send({ success: 'The user is already in the matchlist' }, 200);
								bool = true;
							}
						}
					});
					if (!bool) {
						/* Updates the current user's matchlist */
						match_list.push({ 'name': req.body.otherUser });
						var update = { $set: { 'matchlist': match_list } };
						matchlistdb.findOneAndUpdate({ 'user': req.body.currentUser }, update, function (err) {
							if (err) {
								throw err;
							}
						});
					}
				}
				/* Updates the current user's nomatchlist (removes them from the pool) */
				if (!bool) {
					nomatchlistdb.findOne({ 'user': req.body.currentUser }, function (err, item2) {
						if (err) {
							throw err;
						}
						if (item2 == undefined) {
							nomatchlistdb.insertOne({ 'user': req.body.currentUser, nomatchlist: [{ name: req.body.otherUser }] }, function (err) {
								if (err) {
									throw err;
								}
							});
						}
						else {
							var match_list2 = item2.nomatchlist;
							match_list2.push({ 'name': req.body.otherUser });
							update = { $set: { 'nomatchlist': match_list2 } };
							nomatchlistdb.findOneAndUpdate({ 'user': req.body.currentUser }, update, function (err) {
								if (err) {
									throw err;
								}
							});
						}
					});
				}
				if (!bool) {
					/* looks into the other user's db to see if the currentUser is matched there */
					matchlistdb.findOne({ 'user': req.body.otherUser }, function (err, item) {
						if (err) {
							throw err;
						}
						if (item == undefined) {
							response.send({ 'success': "User has not looked through matches, will notify you if matched" }, 200);
						}
						else {
							item.matchlist.forEach(element => {
								/**
								 * When the user matches with the other user, we gotta update both messagelist
								 */
								if (element.name == req.body.currentUser) {
									var messagelistdb = client.db("partnermev2").collection('message-list');
									/* Update the current user's message list */
									messagelistdb.findOne({ 'user': req.body.currentUser }, function (err, result) {
										if (err) {
											throw err;
										}
										if (result == undefined) {
											messagelistdb.insertOne(
												{ 'user': req.body.currentUser, 'messagelist': [{ 'name': req.body.otherUser }] },
												function (err) {
													if (err) {
														throw (err);
													}
												}
											);
										}
										else {
											var messagelist = result.messagelist;
											messagelist.push({ 'name': req.body.otherUser });
											update = {
												$set: { 'messagelist': messagelist }
											}
											messagelistdb.findOneAndUpdate({ 'user': req.body.currentUser }, update, function (err, updatereturn) {
												if (err) {
													throw err;
												}
											});
										}
									});
									/* Update the other user's message list */
									messagelistdb.findOne({ 'user': req.body.otherUser }, function (err, result) {
										if (err) {
											throw err;
										}
										if (result == undefined) {
											messagelistdb.insertOne(
												{ 'user': req.body.otherUser, 'messagelist': [{ 'name': req.body.currentUser }] },
												function (err) {
													if (err) throw (err)
												}
											);
										}
										else {
											var messagelist = result.messagelist;
											messagelist.push({ 'name': req.body.currentUser });
											update = {
												$set: { 'messagelist': messagelist }
											}
											messagelistdb.findOneAndUpdate({ 'user': req.body.otherUser }, update, function (err) {
												if (err) {
													throw err;
												}
											});
										}
									});
									response.send({ 'success': "User was a match! Both updated" }, 200);
									bool = true;
								}
							});
						}
					});
				}
			});
		}, 1000);
	}
});

/**
 * Match swipe left
 * Updates the nomatchlist database for the current user to contain t
 */
app.post('/matching/swipeleft', (req, response) => {
	if (req.body.currentUser == undefined || req.body.otherUser == undefined) {
		response.send("Cannot update method due to request object not valid");
	}
	else {
		var nomatchlistdb = client.db("partnermev2").collection("no-match-list");
		nomatchlistdb.findOne({ 'user': req.body.currentUser }, function (err, item) {
			if (err) {
				throw err;
			}
			if (item == undefined) {
				nomatchlistdb.insertOne({ 'user': req.body.currentUser, 'nomatchlist': [{ 'name': req.body.otherUser }] }, function (err) {
					if (err) {
						throw err;
					}
					response.send({ 'success': "Successfully created and updated the nomatchlist for current user" }, 200);
				});
			}
			else {
				var nomatchlist = item.nomatchlist;
				nomatchlist.push({ 'name': req.body.otherUser });
				var update = {
					$set: {
						'nomatchlist': nomatchlist
					}
				}
				nomatchlistdb.findOneAndUpdate({ 'user': req.body.currentUser }, update, function (err) {
					if (err) {
						throw err;
					}
					response.send({ 'success': "Successfully updated the nomatchlist for current user" }, 200);
				});
			}
		});
	}
});

/// MESSAGES METHODS ///

/**
 * A method to obtain a chat from the database.
 */
app.post('/messages/getchat', (req, response) => {
	if (req.body.otherUser == undefined || req.body.currentUser == undefined) {
		response.send("Cannot obtain chatlog from other user due to undefined request parameters", 400);
	}
	else {
		var names = [req.body.otherUser, req.body.currentUser];
		names.sort(); // We want to sort the names so that user 1 and user 2 is defined alphabetically
		var messagedb = client.db("partnermev2").collection('chatlogs');

		setTimeout(function () {
			// Fetch the document that we modified
			messagedb.findOne({ 'user1': names[0], 'user2': names[1] }, function (err, item) {
				if (item == undefined) {
					response.send({ "chatlog": [] }, 200);
				}
				else {
					response.send({ "chatlog": item.chatlog }, 200);
				}
			});
		}, 100);
	}
});

/**
 * Main method to handle sending messages. If a user has not chatted with the other user, then
 * a new chatlog would be created betwene the two users.
 */
app.post('/messages/sendmessage', (req, response) => {
	if (req.body.otherUser == undefined || req.body.currentUser == undefined || req.body.message == undefined) {
		response.send("Message to the other user did not complete due to undefined request parameters", 400);
	}
	else {
		var names = [req.body.otherUser, req.body.currentUser];
		names.sort(); // We want to sort the names so that user 1 and user 2 is defined alphabetically
		var messagedb = client.db("partnermev2").collection('chatlogs');
		setTimeout(function () {
			// Fetch the document that we modified
			messagedb.findOne({ 'user1': names[0], 'user2': names[1] }, function (err, item) {
				if (err) {
					throw err;
				}
				if (item == undefined) {
					messagedb.insertOne({
						chat_id: 1,
						user1: names[0],
						user2: names[1],
						chatlog: [{ name: req.body.currentUser, message: req.body.message }]
					},
						function (err, item) {
							if (err) {
								throw err;
							}
							response.send({ "chatlog": [{ name: req.body.currentUser, message: req.body.message }] }, 200);
						});
				}
				else {
					var chatLog = item.chatlog;
					var message = {
						'name': req.body.currentUser,
						'message': req.body.message
					}
					chatLog.push(message);
					var update = { $set: { 'chatlog': chatLog } };
					messagedb.findOneAndUpdate({ 'user1': names[0], 'user2': names[1] }, update, function (err) {
						if (err) {
							throw err;
						}
						response.send({ "chatlog": chatLog }, 200);
					});
				}
			});
		}, 500);
	}
});

app.post('/messages/messagelist', (req, response) => {
	if (req.body.currentUser == undefined) {
		response.send("Cannot obtain messagelist due to undefined request parameters", 400);
	}
	else {
		var messagelistdb = client.db("partnermev2").collection('message-list');
		setTimeout(function () {
			// Fetch the document that we modified
			messagelistdb.findOne({ 'user': req.body.currentUser }, function (err, item) {
				if (err) {
					throw err;
				}
				if (item == undefined) {
					response.send([], 200);
				}
				else {
					response.send({ "listofusers": item.messagelist }, 200);
				}
			});
		}, 100);
	}
});


app.use(express.urlencoded({
	extended: true
}));

module.exports = app;
