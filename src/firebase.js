import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA3vNgLpJ4yWvpfRImCieZdgQNJjxhHN0",
  authDomain: "clone-99d48.firebaseapp.com",
  projectId: "clone-99d48",
  storageBucket: "clone-99d48.appspot.com",
  messagingSenderId: "349347773996",
  appId: "1:349347773996:web:4dca9f87bda2b0eb01db89",
  measurementId: "G-BY04X40ZLL"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };