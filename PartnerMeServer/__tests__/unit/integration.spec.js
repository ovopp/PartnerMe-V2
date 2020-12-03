const backend = require("../../index");
const supertest = require('supertest');
const req = supertest(backend);
const func = require("../../functions");

/* Hello world function (for coverage) */
describe("App get", () => {
    it("Should attempt to run our 'hello world' function as test", async () => {
		const data = await req.get('/');
		expect(data.text == "Hello").toBeTruthy();
    });
});

 /* SIGNING IN AS A NEW USER */

describe("STARTING SIGNIN AS NEW USER: App post checks to see if the user exists in the database", () => {
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
		       "email":"test@10000.com"}; //change this to random
        const data = await req.post('/auth/create').send(input);
	expect(data).toBeTruthy();
    });
});


describe("Check to make sure user is added successfully", () => {
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



/* SIGNING IN AS A OLD USER */

describe("App post user/current-user. Returns the information for the current user", () => {
    it("Should return true", async () => {
	const input = {"email": "vincentyan8@gmail.com"};
	const data = await req.post('/user/current-user').send(input);
    expect(data).toBeTruthy();
    });
});

/* UPDATING USER INFORMATION */

describe("App post user current user. Check to make sure user user exists in our database", () => {
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
	expect(data.body.success).toBeTruthy();
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


 /* MATCHING MODULE */
 /* Swiping right to a user */
 /* Swiping left to a user */

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
			"otherUser": "lllllllhuesus@gmail.com", // change this before running test to anytthing random 1
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
			"currentUser": "lllllllhuesus@gmail.com", // change this before running test to anytthing random 1
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
			"currentUser": "llllllllhulelsusasdf@llgmail.com", // change this before running test to anytthing random
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
			"currentUser": "jeebluls333333@gmail.com", // change this before running test to anytthing random 2
			"otherUser": "ovoppskip@gmail.com"
		};
		const data = await req.post('/matching/swipeleft').send(input);
		expect(data).toBeTruthy();
	})
});


/* Messaging other Users */
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
			"currentUser": "jee3bul333s@gmail.com",   // change this before running test to anytthing random 3
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

