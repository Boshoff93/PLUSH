import firebase from 'firebase'

const config = {
   apiKey: "AIzaSyBgfJOjh-eSOKclta5l2PyxN0GL55O2zAM",
   authDomain: "plush-195723.firebaseapp.com",
   databaseURL: "https://plush-195723.firebaseio.com",
   projectId: "plush-195723",
   storageBucket: "plush-195723.appspot.com",
   messagingSenderId: "729356241272"
 };

 const fire = firebase.initializeApp(config)
 const googleProvider = new firebase.auth.GoogleAuthProvider()
 const facebookProvider = new firebase.auth.FacebookAuthProvider()

 export { fire, googleProvider, facebookProvider }
