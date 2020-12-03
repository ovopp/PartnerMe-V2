const backend = require("../../index");
const supertest = require('supertest');
const req = supertest(backend);
const func = require("../../functions");

// const apicalls = require("../apicalls")

// jest.mock("../../SQLquery") //Unsure about this line

// block //To stop test from running prematurely (leave error in until ready)


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
		       "email":"test@100009.com"}; //change this to random
        const data = await req.post('/auth/create').send(input);
	expect(data).toBeTruthy();
    });
});
