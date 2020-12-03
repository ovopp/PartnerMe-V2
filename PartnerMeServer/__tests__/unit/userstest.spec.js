const backend = require("../../index");
const supertest = require('supertest');
const req = supertest(backend);
const func = require("../../functions");

// const apicalls = require("../apicalls")

// jest.mock("../../SQLquery") //Unsure about this line

// block //To stop test from running prematurely (leave error in until ready)

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
	const item = {
		"Name" : "Vincent Yan" ,
		"Class" : "CPEN 321" ,
		"Language" : "English",
		"Availability" : "Morning",
		"Hobbies" : "Computers, Engineering, Dogs",
		"Email" : "vincentyan8@gmail.com"
	}
        const data = await req.post('/user/current-user').send(input);
	expect(data.body).toBeTruthy();
    });
});

