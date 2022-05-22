import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "********************",
  authDomain: "************",
  projectId: "******",
  storageBucket: "**********",
  messagingSenderId: "*****",
  appId: "**********"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export const auth = getAuth(app);
// export const firebase= (app)

