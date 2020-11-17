const backend = require("../../index");

block //To stop test from running prematurely (leave error in until ready)

describe("App get", () => {
    it("Should attempt to run our 'hello world' function as test", async () => {
        const data = await backend.request(app).get();
	expect(data.body == "Hello").toBeTruth();
    });
});


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
        const data = await backend.request(app).get('/dbproxy').send(query);
	expect(data.body == "Example row for query: ${query}").toBeTruth();
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
        const data = await backend.request(app).get('/dbproxy').send(query);
	expect(data.body == "success").toBeTruth();
    });
});
