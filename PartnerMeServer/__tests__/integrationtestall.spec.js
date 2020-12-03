const backend = require("../index");
const supertest = require('supertest');
const req = supertest(backend);

/**
 * Welcome to integration testing: Api's that are exposed in the front-end are:
 * 
 * For Authorization and Making new User
 * app.post('/user/update')
 * app.post('/user/current-user')
 * app.post('/auth/check')
 * app.post('/auth/create')
 * 
 * For Matching
 * app.post('/matching/getmatch')
 * app.post('/matching/sendmessage')
 * app.post('/collaboration/schedule')
 */

 
 /* SIGNING IN AS A NEW USER */

 block 
describe("STARTING SIGNIN AS NEW USER: App post checks to see if the user exists in the database", () => {
    it("It should return False since we don't have the user in the database", async () => {
	const input = {"email": "vincentyan8@test.com"};
		const data = await req.post('/auth/check').send(input);
    expect(data.body.error).toBeFalsy();
    done();
    });
});

describe("Once check it doesn't exist, we then create the new user via form", () => {
    it("It should return False since all the fields are inaccurate", async () => {
        const input = {"name":"",
        "class":"",
        "language":"",
        "availability":"",
        "hobbies":"",
        "email":"vincentyan8@test.com"};
		const data = await req.post('/auth/create').send(input);
    expect(data.body.message).toBeFalsy();
    done();
    });
});

describe("Once check it doesn't exist, we then create the new user via form", () => {
    it("It should return True since all the fields are accurate", async () => {
        const input = {"name":"test",
        "class":"test",
        "language":"test",
        "availability":"test",
        "hobbies":"test",
        "email":"vincentyan8@test.com"};
	const data = await req.post('/auth/create').send(input)
	expect(data.body.success).toBeTruthy();
    done();
    });
});

describe("Check to make sure user is added successfully", () => {
    it("It should return True since we the user is now in the database", async () => {
	const input = {"email": "vincentyan8@test.com"};
		const data = await req.post('/auth/check').send(input);
    expect(data.body.success).toBeTruthy();
	done();
    });
});


/* SIGNING IN AS A OLD USER */
describe("STARTING SIGNIN AS OLD USER: App post checks to see if the user exists in the database", () => {
    it("It should return True since we have the user in the database", async () => {
	const input = {"email": "vincentyan8@gmail.com"};
		const data = await req.post('/auth/check').send(input);
    expect(data.body.error).toBeTruthy();
    done();
    });
});

describe("App post user/current-user. Returns the information for the current user", () => {
    it("Should return true", async () => {
	const input = {"email": "vincentyan8@gmail.com"};
	const data = await req.post('/user/current-user').send(input);
    expect(data.body.email).toBeTruthy();
    done();
    });
});



/* UPDATING USER INFORMATION */

describe("STARTING UPDATING USER INFO: App post user/current/user. Check to make sure user user exists in our database", () => {
    it("user/current-user checker to return the current user values and display on view", async () => {
	const input = {"email": "vincentyan8@test.com"};
	const data = await req.post('/user/current-user').send(input);
    expect(data.body === {"name":"test",
    "class":"test",
    "language":"test",
    "availability":"test",
    "hobbies":"test",
    "email":"vincentyan8@test.com"}).toBeTruthy();
    });
});

describe("App post user/current-user. Check to make sure user user exists in our database", () => {
    it("Should return false", async () => {
	const input = {"email": "asdf@blahblah.com"};
	const data = await req.post('/user/current-user').send(input);
    expect(data.body.error === "No user found, please resign-in and register").toBeTruthy();
    });
});


describe("App post user update. Updating user information", () => {
    it("Should return with success", async () => {
	const input = {"name":"test1",
		       "class":"test1",
		       "language":"test1",
		       "availability":"test1",
		       "hobbies":"test1",
		       "email":"vincentyan8@test.com"};
        const data = await req.post('/user/update').send(input);
    expect(data.body.success ==  true).toBeTruthy();
    });
});

describe("App post user update. Updating user information fail", () => {
    it("Should return with failure", async () => {
	const input = {"class":"test",
		       "language":"test",
		       "availability":"test",
		       "hobbies":"test",
		       "email":"vincentyan8@test.com"};
        const data = await req.post('/user/update').send(input);
    expect(data.body.message ==  "Cannot update user because the request body is undefined").toBeTruthy();
    });
});

describe("App post /user/current-user. Check to make sure update was successful", () => {
    it("Should return with success", async () => {
	const input = {"email":"vincentyan8@test.com"};
    const data = await req.post('/user/current-user').send(input);
	expect(data.body ==  {
        "user": {
            "ID": 7,
            "Email": "vincentyan8@test.com",
            "Name": "test1",
            "Class": "test1",
            "Language": "test1",
            "Availability": "test1",
            "Hobbies": "test1",
            "Token": null
        }
    }).toBeTruthy();
    });
});


 /* MATCHING MODULE */

 describe("STARTING MATCHING: App post /user/current-user. Gets the current user's information", () => {
    it("Should return with success", async () => {
	const input = {"email":"vincentyan8@test.com"};
    const data = await req.post('/user/current-user').send(input);
	expect(data.body.user).toBeTruthy();
    done();
    });
});


describe("App post /matching/getmatch. Gets a list of matches for new user based on their hobbies", () => {
    it("Should return with success, but no matches", async () => {
	const input = {"email":"vincentyan8@test.com"};
    const data = await req.post('/matching/getmatch').send(input);
    expect(data.body.match_result == []).toBeTruthy();
    });
});


describe("App post /matching/getmatch. Gets a list of matches for an old user based on their hobbies", () => {
    it("Should return with success, and have matches", async () => {
	const input = {"email":"vincentyan8@gmail.com"};
    const data = await req.post('/matching/getmatch').send(input);
    console.log(data);
    expect(data.body.match_result.length >= 0).toBeTruthy();
    });
});

// will have more tests after set-up messaging
/*describe("App post /matching/sendmessage. Sends a message to the other matched user", () => {
    it("Should return with success", async () => {
	const input = {"email":"vincentyan8@gmail.com"};
    const data = await req.post('/matching/sendmessage').send(input);
    expect(data.body.text).toBeTruthy();
    done();
    });
});*/
