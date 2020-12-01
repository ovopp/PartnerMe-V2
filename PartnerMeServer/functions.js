const { Connection, Request } = require("tedious");
var similarity = require( 'compute-cosine-similarity' );

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

function cosineSim(req, reqString, callback){
    var return_list = [];
    var return_user_list = [];
    var user_hobby_list = [];
    const request = new Request(
      reqString,
       (err, rowCount, rows) => {
         if (err) {
           console.error(err.message);
         } else {
           console.log(`${rowCount} row(s) returned`);
           if(rowCount == 0){
            callback([]);
           }
           else{
           for(let i = 0 ; i < rows.length ; i++){
             if(req.body.email == rows[i][1].value)
             {
               user_hobby_list = rows[i][6].value.split(", ");
             }
             else{
             var item = {
               "Name" : rows[i][2].value ,
               "Class" : rows[i][3].value ,
               "Language" : rows[i][4].value,
               "Availability" : rows[i][5].value,
               "Hobbies" : rows[i][6].value,
               "Email" : rows[i][1].value
               }
               return_user_list.push(item);
             }
           }

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
           callback(return_list);
         }
        }
       }
     );
      connection.execSql(request);
  }

function queryDatabase(query, callback) {
	    const request = new Request(
		query,
		(err, rowCount) => {
		    if (err) {
			callback(err,null);
		    } else {
			console.log(`Success: ${rowCount} row(s) returned`);
			callback(null,rowCount);
		    }
		}
	    );
	    connection.execSql(request);
}

function querySelectDatabase(query, callback) {
	    const request = new Request(
		query,
		(err, rowCount, rows) => {
		    if (err) {
			callback(err,null,null);
		    } else {
			console.log(`Success: ${rowCount} row(s) returned`);
			callback(null,rowCount,rows);
		    }
		}
	    );
	    connection.execSql(request);
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
