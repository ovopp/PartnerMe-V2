var mysql = require('mysql');
var similarity = require( 'compute-cosine-similarity' );

const config = {
    user "partnermeteam",
    password: "df67POIL!#",
    server: "partnerme.database.windows.net",
    database: "partnerme",
    encrypt: true
};

const connection = new Connection(config);

function cosineSim(req, reqString){
  var t = new Date();
  var n = t.getTime();
    var return_list = [];
    var return_user_list = [];
    var user_hobby_list = [];
    // var user_hobby_list = ['CPEN', 'elec', 'dogs'];
    // var response_return = [{"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"test, asdf, fdasd",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"CPEN, test, asdf, fdasd",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"CPEN, test",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"elec, dogs",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"dogs",
    // "email":"test"},{"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"test, asdf, fdasd",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"CPEN, test, asdf, fdasd",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"CPEN, test",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"elec, dogs",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"dogs",
    // "email":"test"},{"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"test, asdf, fdasd",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"CPEN, test, asdf, fdasd",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"CPEN, test",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"elec, dogs",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"dogs",
    // "email":"test"},{"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"test, asdf, fdasd",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"CPEN, test, asdf, fdasd",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"CPEN, test",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"elec, dogs",
    // "email":"test"}, {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"dogs",
    // "email":"test"}];
    // var user = {"name":"test",
    // "class":"test",
    // "language":"test",
    // "availability":"test",
    // "hobbies":"CPEN, elec, dogs",
    // "email":"test"}
    const request = new Request(
      reqString,
       (err, rowCount, rows) => {
         if (err) {
           console.error(err.message);
         } else {
           console.log(`${rowCount} row(s) returned`);
           if(rowCount == 0){
            return {"match_result" : []}
           }
           for(let i = 0 ; i < rows.length ; i++){
             if(req.body.email == rows[i][5].value)
             {
               user_hobby_list = rows[i][4].value.split(", ");
             }
             else{
             var item = {
               "Name" : rows[i][0].value ,
               "Class" : rows[i][1].value ,
               "Language" : rows[i][2].value,
               "Availability" : rows[i][3].value,
               "Hobbies" : rows[i][4].value,
               "Email" : rows[i][5].value
               }
               return_user_list.push(item);
             }
           }
           connection.close();
          // for(let i = 0; i < response_return.length; i ++){
          //   var item = {
          //                "Name" : response_return[i].name ,
          //                "Class" : response_return[i].class,
          //                "Language" : response_return[i].language,
          //                "Availability" : response_return[i].availability,
          //                "Hobbies" : response_return[i].hobbies,
          //                "Email" : response_return[i].email
          //                }
          //   return_user_list.push(item);
          // }

           for(let i = 0; i < return_user_list.length ; i++){
             var otherUserList = return_user_list[i].Hobbies.split(", ");
             var userHobbyListTmp = user_hobby_list;
             
             // initialize the dictionaries
             var dictionary = {};
             var tmpdict = {};
             // add keys from the lists to the dictionary
             for(let j = 0; j < otherUserList.length ; j++){
               if(!(otherUserList[j] in dictionary)){
                 dictionary[otherUserList[j]] = 0;
                 tmpdict[otherUserList[j]] = 0;
               }
             }
             for(let j = 0; j < userHobbyListTmp.length ; j++){
               if(!(userHobbyListTmp[j] in dictionary)){
                 dictionary[userHobbyListTmp[j]] = 0;
                 tmpdict[userHobbyListTmp[j]] = 0;
               }
             }
             // populate the dictionary to both dicts from the words from the list (vectors)
             for(let j = 0; j < otherUserList.length; j++){
               dictionary[otherUserList[j]] += 1;
             }
             for(let j = 0; j < userHobbyListTmp.length; j++){
               tmpdict[userHobbyListTmp[j]] += 1;
             }
             // empty the lists to be used to hold the values of the dict.
             otherUserList = [];
             userHobbyListTmp = [];
             for(const key of Object.keys(dictionary)){
               if(key != undefined){
                 otherUserList.push(dictionary[key]);
               }
             }
             for(const key of Object.keys(tmpdict)){
                 userHobbyListTmp.push(tmpdict[key]);
             }
             return_list.push({"similarity" : similarity(otherUserList, userHobbyListTmp), "userList": return_user_list[i]});
           }
           return_list.sort(compare);
           // response.send({"match result" :return_list});
         }
       }
     );
      connection.execSql(request);
      return {"match_result" :return_list};
  }

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
			callback(err,null);
		    } else {
			console.log(`Success: ${rowCount} row(s) returned`);
			connection.close();
			callback(null,rows);
		    }
		}
	    );
	    console.log(connection.execSql(request));
	}
    });
}

function compare( a, b ) {
    if ( a.similarity > b.similarity ){
      return -1;
    }
    if ( a.similarity < b.similarity ){
      return 1;
    }
    return 0;
  }

  module.exports = {
    compare : compare,
    queryDatabase : queryDatabase,
    cosineSim : cosineSim,
    querySelectDatabase : querySelectDatabase
  };
