var similarity = require( 'compute-cosine-similarity' );

function cosineSim(req, user_list){
  var return_list = [];
  var return_user_list = [];
  var user_hobby_list = [];
  /**
   * 1) Find all users that have the same class as I do -> use find()
   * 2) In the item list, do what we did before
   * 3) Profit
   */
  for(var i = 0; i < user_list.length; i++){
    if(req.body.email == user_list[i].email){
      user_hobby_list = user_list[i].hobbies.split(", ");
    }
    else{
    var item = {
      "Name" :user_list[i].name,
      "Class" : user_list[i].class ,
      "Language" : user_list[i].language,
      "Availability" : user_list[i].availability,
      "Hobbies" :user_list[i].hobbies,
      "Email" : user_list[i].email
    };
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
  return return_list;
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
  cosineSim : cosineSim
};