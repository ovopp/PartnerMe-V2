const backend = require("../../index");
jest.mock("../../SQLquery") //Unsure about this line

// block //To stop test from running prematurely (leave error in until ready)

//Hello world function
describe("App get", () => {
    it("Should attempt to run our 'hello world' function as test", async () => {
        const data = await backend.request(app).get('/');
	expect(data.body == "Hello").toBeTruth();
    });
});


//Users
describe("App get dbproxy test", () => {
    it("Should attempt to run a select query on the db", async () => {
	const query = "SELECT name FROM users";
        const data = await backend.request(app).get('/dbproxy').send(query);
	expect(data.body == "Example row for query: ${query}").toBeTruth();
    });
});

describe("App post user update #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
        const data = await backend.request(app).post('/user/update').send(input);
	expect(data.body == "invalid json object").toBeTruth();
    });
});

describe("App post user update #2", () => {
    it("Should return with success", async () => {
	const input = {"name":"test",
		       "class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":"test"};
        const data = await backend.request(app).post('/user/update').send(input);
	expect(data.body == "success").toBeTruth();
    });
});

describe("App post user current user #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
        const data = await backend.request(app).post('/user/curren-user').send(input);
	expect(data.message == "invalid json object").toBeTruth();
    });
});

describe("App post user current user #2", () => {
    it("Should return with success", async () => {
	const input = {"name":"test",
		       "class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":"test"};
        const data = await backend.request(app).post('/user/current-user').send(input);
	expect(data.body == "success").toBeTruth();
    });
});

//Authentication
describe("App post auth check #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
        const data = await backend.request(app).post('/auth/check').send(input);
	expect(data.message == "invalid json object").toBeTruth();
    });
});

describe("App post auth check #2", () => {
    it("Should return with success", async () => {
	const input = {"name":"test",
		       "class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":"test"};
        const data = await backend.request(app).post('/auth/check').send(input);
	expect(data.body == "success").toBeTruth();
    });
});

describe("App post auth create #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
        const data = await backend.request(app).post('/auth/create').send(input);
	expect(data.message == "invalid json object").toBeTruth();
    });
});

describe("App post auth create #2", () => {
    it("Should return with success", async () => {
	const input = {"name":"test",
		       "class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":"test"};
        const data = await backend.request(app).post('/auth/create').send(input);
	expect(data.body == "success").toBeTruth();
    });
});

describe("App post auth get user #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
        const data = await backend.request(app).post('/auth/getuser').send(input);
	expect(data.message == "invalid json object").toBeTruth();
    });
});

describe("App post auth get user #2", () => {
    it("Should return with success", async () => {
	const input = {"name":"test",
		       "class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":"test"};
        const data = await backend.request(app).post('/auth/getuser').send(input);
	expect(data.body == "success").toBeTruth();
    });
});

//Matching service
describe("App post matching get match #1", () => {
    it("Should return with an error", async () => {
	const input = {"name":"",
		       "class":"",
		       "language":"",
		       "availability":"",
		       "hobbies":""};
        const data = await backend.request(app).post('/matching/getmatch').send(input);
	expect(data.message == "invalid json object").toBeTruth();
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
        const data = await backend.request(app).post('/matching/getmatch').send(input);
	expect(data.body == "success").toBeTruth();
    });
});

// First test we won't have a match since there isn't a test@gmail.com account
describe("Cosine similarity", () => {
    it("Should return with empty user", async () => {
	const req = {'body' : {'email' : 'test@gmail.com'}};
	const query = `SELECT * FROM test WHERE class IN ( SELECT class FROM test WHERE email = '${req.body.email}')`;
        const data = await backend.cosineSim(req, query);
	expect(data == {"match result" : []}).toBeTruth();
    });
});


describe("Cosine similarity", () => {
    it("Should return with success and return first user to be self", async () => {
	const req = {'body' : {'email' : 'vincentyan8@gmail.com'}};
	const query = `SELECT * FROM test WHERE class IN ( SELECT class FROM test WHERE email = '${req.body.email}')`;

	expect(data == {"match result" : [{'similarity' : 1, 'userlist' : {
			"Name" : "Vincent Yan" ,
			"Class" : "CPEN 321" ,
			"Language" : "English",
			"Availability" : "Morning",
			"Hobbies" : "Computers, Engineering, Dogs",
			"Email" : "vincentyan8@gmail.com"
		}
		}]}).toBeTruth();
    });
});

			 
describe("App post matching send message", () => {
    it("Should return with success", async () => {
	const input = {"name":"test",
		       "class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":"test"};
        const data = await backend.request(app).post('/matching/sendmessage').send(input);
	expect(data.body == "external services").toBeTruth();
    });
});