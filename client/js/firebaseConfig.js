import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEhYVpzceitH6-sqYuZIFXm30vcDjVH7E",
  authDomain: "chatgpt-clone-6091f.firebaseapp.com",
  databaseURL:
    "https://chatgpt-clone-6091f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chatgpt-clone-6091f",
  storageBucket: "chatgpt-clone-6091f.appspot.com",
  messagingSenderId: "400132271201",
  appId: "1:400132271201:web:5a097b0dec919e1c3a8e20",
  measurementId: "G-K59QNRMBKY",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
