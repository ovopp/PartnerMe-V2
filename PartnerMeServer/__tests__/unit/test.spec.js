const backend = require("../../index");
const supertest = require('supertest');
const req = supertest(backend);
const func = require("../../functions");
block 
var email1 = Math.floor(Math.random()*1000000).toString() + "@gmail.com";
var email2 = Math.floor(Math.random()*1000000).toString() + "@gmail.com";
var email3 = Math.floor(Math.random()*1000000).toString() + "@gmail.com";
var email4 = Math.floor(Math.random()*1000000).toString() + "@gmail.com";

// const apicalls = require("../apicalls")

// jest.mock("../../SQLquery") //Unsure about this line

// block //To stop test from running prematurely (leave error in until ready)

/* Hello world function */
describe("App get", () => {
    it("Should attempt to run our 'hello world' function as test", async () => {
		const data = await req.get('/');
		expect(data.text == "Hello").toBeTruthy();
    });
});

/* USER TESTS */ 
/* App post user update */
describe("App post user update #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
		const data = await req.post('/user/update').send(input);
	expect(data.body.message === "Cannot update user because the request body is undefined").toBeTruthy();
    });
});

describe("App post user update #2", () => {
    it("Should return with failure", async () => {
	const input = {"name":"test",
		       "class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":"test"};
        const data = await req.post('/user/update').send(input);
	expect(data.body.success).toBeFalsy();
    });
});

describe("App post user update token #1", () => {
    it("Should return with failure", async () => {
	const input = {"token": "test",
		       "email":"vincentyan8@test.com"};
        const data = await req.post('/user/update').send(input);
	expect(data).toBeTruthy();
    });
});

describe("App post user update token #2", () => {
    it("Should return with failure", async () => {
	const input = {"esafsdfmail":"test"};
        const data = await req.post('/user/updatetoken').send(input);
	expect(data).toBeTruthy();
    });
});

/*App post user current user */
describe("App post user current user #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
        const data = await req.post('/user/current-user').send(input);
	expect(data.body.message == "Request query is invalid for current user").toBeTruthy();
    });
});

describe("App post user current user #2", () => {
    it("Should return with success", async () => {
	const input = {"email": 'vincentyan8@gmail.com'};
    const data = await req.post('/user/current-user').send(input);
	expect(data).toBeTruthy();
    });
});

/* AUTHENTICATION TESTS */

/* App post auth check */
describe("App post auth check #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
        const data = await req.post('/auth/check').send(input);
	expect(data.body.message == "No email provided for authentication").toBeTruthy();
    });
});


describe("App post auth check #2", () => {
    it("Should return with success", async () => {
	const input = {"name":"test",
		       "class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":"vincentyan8@gmail.com"};
        const data = await req.post('/auth/check').send(input);
	expect(data.body.success == true).toBeTruthy();
    });
});

/* App POST auth create */
describe("App post auth create #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
        const data = await req.post('/auth/create').send(input);
	expect(data.body.message == "Create new user failed due to request fields not being valid").toBeTruthy();
    });
});

describe("App post auth create #2", () => {
    it("Should return with not success", async () => {
	const input = {"name":"test",
		       "class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":email1};
        const data = await req.post('/auth/create').send(input);
	expect(data).toBeTruthy();
    });
});

/* MATCHING SERVICE TESTS */

/* APP POST Matching */
describe("App post matching get match #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
        const data = await req.post('/matching/getmatch').send(input);
	expect(data.body.message == "User email parameter is invalid for matching").toBeTruthy();
    });
});

describe("App post matching get match #2", () => {
    it("Should return with success", async () => {
	const input = {"name":"test",
		       "class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":"test"};
        const data = await req.post('/matching/getmatch').send(input);
	expect(data.body != null).toBeTruthy();
    });
});

describe("App POST matching swipe right #1", () =>{
	it("Should return with success", async() => {
		const input = {
			"otherUser": "blueseakr24@gmail.com",
			"currentUser": "ovoppskip@gmail.com",
			"token": "faUrmzVBQl6V-WlXSfQ9ld:APA91bFR36ZEeh29B5DceQMUfr45c4SH5L5UpSp7PZ5bVLifqYYWZeD5ZaVQmS7Ln4PPx_lEO_jvJiLPfxFBQQJecBuWpcLA0q7ve-M-2qEhcj-n_k9QKRJdffc7mlD61NUGCWtoLWAv"
		};
		const data = await req.post('/matching/swiperight').send(input);
		expect(data.body.success == "The user is already in the matchlist").toBeTruthy();
	})
});

describe("App POST matching swipe right #2", () =>{
	it("Should return with success", async() => {
		const input = {
			"otherUser": email2, // change this before running test to anytthing random 1
			"currentUser": "ovoppskip@gmail.com",
			"token": "faUrmzVBQl6V-WlXSfQ9ld:APA91bFR36ZEeh29B5DceQMUfr45c4SH5L5UpSp7PZ5bVLifqYYWZeD5ZaVQmS7Ln4PPx_lEO_jvJiLPfxFBQQJecBuWpcLA0q7ve-M-2qEhcj-n_k9QKRJdffc7mlD61NUGCWtoLWAv"
		};
		const data = await req.post('/matching/swiperight').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST matching swipe right #3", () =>{
	it("Should return with success", async() => {
		const input = {
			"currentUser":email2, // change this before running test to anytthing random 1
			"otherUser": "ovoppskip@gmail.com",
			"token": "faUrmzVBQl6V-WlXSfQ9ld:APA91bFR36ZEeh29B5DceQMUfr45c4SH5L5UpSp7PZ5bVLifqYYWZeD5ZaVQmS7Ln4PPx_lEO_jvJiLPfxFBQQJecBuWpcLA0q7ve-M-2qEhcj-n_k9QKRJdffc7mlD61NUGCWtoLWAv"
		};
		const data = await req.post('/matching/swiperight').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST matching swipe right #4", () =>{
	it("Should return with false", async() => {
		const input = {
			"asdf": "lhuesus@gmail.com",
			"otherUsasdfer": "ovoppskip@gmail.com",
			"token": "faUrmzVBQl6V-WlXSfQ9ld:APA91bFR36ZEeh29B5DceQMUfr45c4SH5L5UpSp7PZ5bVLifqYYWZeD5ZaVQmS7Ln4PPx_lEO_jvJiLPfxFBQQJecBuWpcLA0q7ve-M-2qEhcj-n_k9QKRJdffc7mlD61NUGCWtoLWAv"
		};
		const data = await req.post('/matching/swiperight').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST matching swipe left #1", () =>{
	it("Should return with success", async() => {
		const input = {
			"currentUser": email3, // change this before running test to anytthing random
			"otherUser": "ovoppskip@gmail.com"
		};
		const data = await req.post('/matching/swipeleft').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST matching swipe left #2", () =>{
	it("Should return with fail", async() => {
		const input = {
			"currentUser": "lhuesus@gmail.com",
			"asdf": "ovoppskip@gmail.com"
		};
		const data = await req.post('/matching/swipeleft').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST matching swipe left #3", () =>{
	it("Should return with success", async() => {
		const input = {
			"currentUser": email4, // change this before running test to anytthing random 2
			"otherUser": "ovoppskip@gmail.com"
		};
		const data = await req.post('/matching/swipeleft').send(input);
		expect(data).toBeTruthy();
	})
});


/* MESSAGING FUNCTIONS */
describe("App POST get chat #1", () =>{
	it("Should return with empty chat", async() => {
		const input = {
			"currentUser": "jeeblus@gmail.com", 
			"otherUser": "ovoppskip@gmail.com"
		};
		const data = await req.post('/messages/getchat').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST get chat #2", () =>{
	it("Should return with chat", async() => {
		const input = {
			"currentUser": "blueseakr24@gmail.com",
			"otherUser": "ovoppskip@gmail.com"
		};
		const data = await req.post('/messages/getchat').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST get chat #3", () =>{
	it("Should return with error", async() => {
		const input = {
			"currentasdfUser": "blueseakr24@gmail.com",
			"otherUasdfser": "ovoppskip@gmail.com"
		};
		const data = await req.post('/messages/getchat').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST sendmessage #1", () =>{
	it("Should return with error", async() => {
		const input = {
			"currenasdftUser": "jeebus@gmail.com", 
			"otherUseasdfr": "ovoppskip@gmail.com"
		};
		const data = await req.post('/messages/sendmessage').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST sendmessage #2", () =>{
	it("Should return with new message", async() => {
		const input = {
			"currentUser": email5,  
			"otherUser": "ovoppskip@gmail.com",
			"message": "hi"
		};
		const data = await req.post('/messages/sendmessage').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST sendmessage #3", () =>{
	it("Should return with success", async() => {
		const input = {
			"currentUser": "blueseakr24@gmail.com",  
			"otherUser": "ovoppskip@gmail.com",
			"message": "hi"
		};
		const data = await req.post('/messages/sendmessage').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST messagelist #1", () =>{
	it("Should return with success", async() => {
		const input = {
			"currentUser": "blueseakr24@gmail.com",
			"otherUser": "ovoppskip@gmail.com"
		};
		const data = await req.post('/messages/messagelist').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST messagelist #2", () =>{
	it("Should return with error", async() => {
		const input = {
			"currentUser": "gross222@gmail.com",  
			"otherUser": "ovoppskip@gmail.com"
		};
		const data = await req.post('/messages/messagelist').send(input);
		expect(data).toBeTruthy();
	})
});

describe("App POST messagelist #3", () =>{
	it("Should return with error", async() => {
		const input = {
			"curreasdfntUser": "gross@gmail.com",  
			"otherasdfUser": "ovoppskip@gmail.com"
		};
		const data = await req.post('/messages/messagelist').send(input);
		expect(data).toBeTruthy();
	})
});



/* FUNCTIONS.JS TESTS */

// First test we won't have a match since there isn't a test@gmail.com account
describe("Cosine similarity", () => {
    it("Should return with empty user", async () => {
	const req = {'body' : {'email' : email4}};
	const query = `SELECT * FROM test WHERE class IN ( SELECT class FROM test WHERE email = '${req.body.email}')`;
	const data = await func.cosineSim(req, query);
	expect(data).toBeFalsy();
    });
});

// Second test should return matches with self
describe("Cosine similarity", () => {
    it("Should return with success and return first user to be self", async () => {
	const req = {'body' : {'email' : 'vincentyan8@gmail.com'}};
	const query = `SELECT * FROM test WHERE class IN ( SELECT class FROM test WHERE email = '${req.body.email}')`;
	const data = await func.cosineSim(req, query);
	expect(data != {"match result" : []}).toBeTruthy();
    });
});

describe("Unit testing functions in function.js", () => {
    it("Should return comparison", async () => {
	a = {'similarity' : 5};
	b = {'similarity' : 5};
	c = {'similarity' : 4};
	d = {'similarity' : 6};
	const data = func.compare(a,b);
	const data2 = func.compare(a,c);
	const data3 = func.compare(a,d);
	expect(data == 0).toBeTruthy();
	expect(data2 == -1).toBeTruthy();
	expect(data3 == 1).toBeTruthy();
    });
});

describe("Unit testing functions in function.js", () => {
    it("Should return not 0 since we have data in the database", async () => {
	func.queryDatabase(`SELECT * FROM users`, function(err, data){
	    expect(data !== 0).toBeTruthy();
	});
    });
});

describe("Unit testing functions in function.js", () => {
    it("Should be undefined since we don't have the table 'test' in database", async () => {
	func.querySelectDatabase(`SELECT * FROM test`, function(err, data, rows){
	    expect(rows).toBeFalsy();
	});
    });
});
