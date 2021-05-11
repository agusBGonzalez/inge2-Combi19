import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


const config = {
    apiKey: "AIzaSyDMnuqlqojpzNJXBzP_MsabT7BN-G4x56E",
    authDomain: "combi19.firebaseapp.com",
    projectId: "combi19",
    storageBucket: "combi19.appspot.com",
    messagingSenderId: "819006132259",
    appId: "1:819006132259:web:105f062d17307919df2196",
    measurementId: "G-HLG784BP6K"
  };
  // Initialize Firebase
  const fireb = firebase.initializeApp(config);
  const store = fireb.firestore()
  const auth = fireb.auth()

  export {auth, store}
 