const backend = require("../../index");
const supertest = require('supertest');
const req = supertest(backend);
const func = require("../../functions");

// const apicalls = require("../apicalls")

// jest.mock("../../SQLquery") //Unsure about this line

block //To stop test from running prematurely (leave error in until ready)

/* FUNCTIONS.JS TESTS */

// First test we won't have a match since there isn't a test@gmail.com account
describe("Cosine similarity", () => {
    it("Should return with empty user", async () => {
	const req = {'body' : {'email' : 'test@gmail.com'}};
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
