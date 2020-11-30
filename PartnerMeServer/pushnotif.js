var admin = require("firebase-admin");

var serviceAccount = require("./firebasekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-application-5befc.firebaseio.com"
});

var registrationToken = "e0p3DgPZRJOfboDPnCrv4A:APA91bGZPeZsQJSQzRwmOzGbSwVdxT74VKlkyJlOWUj2J8DGLg7ELuYgdTu3eoHA1cv31zkQG_Ky1VG604j4skvv3oaCQSiBM437aRjAgy0OP-H9kn6Dhe6vJwKGJXv7q-pJLTvXqxE0";


var payload = {
  notification: {
    title: "hello",
    body: "hi"
  }
};

admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });



