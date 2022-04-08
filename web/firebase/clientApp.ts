import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrigF_V1k5Jrq4LEi7sD4_G46WYn0smsg",
  authDomain: "hotspot-bab51.firebaseapp.com",
  projectId: "hotspot-bab51",
  storageBucket: "hotspot-bab51.appspot.com",
  messagingSenderId: "1068595285819",
  appId: "1:1068595285819:web:830b3a5e9f8a927452711e",
  measurementId: "G-ZD2ZEPRFME"
};

const firebase = initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebase);
export const db = getFirestore(firebase);

export default firebase;