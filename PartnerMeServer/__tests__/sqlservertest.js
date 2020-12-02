const { Connection, Request } = require("tedious");

const config = {
  authentication: {
    options: {
      userName: "partnermeteam",
      password: "df67POIL!#"
    },
    type: "default"
  },
  server: "partnerme.database.windows.net",
  options: {
    database: "PartnerMe",
    encrypt: true,
    rowCollectionOnRequestCompletion: true
  }
};

const connection = new Connection(config);

function queryDatabase(query, callback) {
    connection.on("connect", err => {
	if (err) {
	    console.log("error");
	    console.error(err.message);
	}
	else {
	    const request = new Request(
		query,
		(err, rowCount) => {
		    if (err) {
			callback(err,null);
		    } else {
			console.log(`Success: ${rowCount} row(s) returned`);
			connection.close();
			callback(null,rowCount);
		    }
		}
	    );
	    console.log(connection.execSql(request));
	}
    });
}

function querySelectDatabase(query, callback) {
    connection.on("connect", err => {
	if (err) {
	    console.log("error");
	    console.error(err.message);
	}
	else {
	    const request = new Request(
		query,
		(err, rowCount, rows) => {
		    if (err) {
			callback(err,null,null);
		    } else {
			console.log(`Success: ${rowCount} row(s) returned`);
			connection.close();
			callback(null,rowCount,rows);
		    }
		}
	    );
	    console.log(connection.execSql(request));
	}
    });
}

querySelectDatabase("SELECT * FROM users", function(err, rowCount, rows) {
    if (err) {
	console.log(err);
    } else {
	console.log(rows);
    }
    expect(rows).toBeTruthy();
});

describe("queryDatabase", () => {
    it("Should return with row count", async () => {
	querySelectDatabase("SELECT * FROM users", function(err, rowCount) {
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
	querySelectDatabase("SELECT * FROM users", function(err, rowCount, rows) {
	    if (err) {
		console.log(err);
	    } else {
		console.log(rows);
	    }
	    expect(rows).toBeTruthy();
	});
    });
});

/*
var mysql = require('mysql');

const config = {
    user: "partnermeteam",
    password: "df67POIL!#",
    server: "partnerme.database.windows.net",
    database: "partnerme",
    encrypt: true
};

const connection = mysql.createConnection(config);

connection.query("SELECT * FROM users", function(err, rows, fields) {
    if (err) console.log(err);
    else console.log(rows);
});*/
