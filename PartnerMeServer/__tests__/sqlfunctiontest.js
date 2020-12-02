const func = require('../functions');

console.log("started");

describe("queryDatabase", () => {
    it("Should return with row count", async () => {
	func.querySelectDatabase("SELECT * FROM users", function(err, rowCount) {
	    if (err) {
		console.log(err);
	    } else {
		console.log(rows);
	    }
	    expect(rowCount).toBeTruthy();
	});
    });
});


describe("querySelectDatabase", () => {
    it("Should return with rows", async () => {
	func.querySelectDatabase("SELECT * FROM users", function(err, rowCount, rows) {
	    if (err) {
		console.log(err);
	    } else {
		console.log(rows);
	    }
	    expect(rowCount).toBeTruthy();
	    expect(rows).toBeTruthy();
	});
    });
});
