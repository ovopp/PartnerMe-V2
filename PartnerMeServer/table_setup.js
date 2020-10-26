const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "partnermeteam", // update me
      password: "df67POIL!#" // update me
    },
    type: "default"
  },
  server: "partnerme.database.windows.net", // update me
  options: {
    database: "PartnerMe", //update me
    encrypt: true
  }
};

const connection = new Connection(config);
console.log("connection made");
// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
    if (err) {
	console.log("error");
    console.error(err.message);
  } else {
    queryDatabase();
  }
});

function queryDatabase() {

  // Creates table
  const request = new Request(
    `CREATE TABLE users (name VARCHAR(255), class VARCHAR(255), language VARCHAR(255), availability VARCHAR(255), hobbies nvarchar(max))`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Table Created!`);
      }
    }
  );

    connection.execSql(request);
}
