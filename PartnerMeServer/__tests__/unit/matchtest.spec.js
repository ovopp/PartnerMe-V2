const backend = require("../../index");
const supertest = require('supertest');
const req = supertest(backend);
const func = require("../../functions");

// const apicalls = require("../apicalls")

// jest.mock("../../SQLquery") //Unsure about this line

// block //To stop test from running prematurely (leave error in until ready)

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
			"otherUser": "llllllhuesus@gmail1.com", // change this before running test to anytthing random 1
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
			"currentUser": "llllllhuesus@gmail1.com", // change this before running test to anytthing random 1
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
			"currentUser": "llllllllhuelsusasdf@llgmail1.com", // change this before running test to anytthing random
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
			"currentUser": "jeebluls3333@gmail1.com", // change this before running test to anytthing random 2
			"otherUser": "ovoppskip@gmail.com"
		};
		const data = await req.post('/matching/swipeleft').send(input);
		expect(data).toBeTruthy();
	})
});

