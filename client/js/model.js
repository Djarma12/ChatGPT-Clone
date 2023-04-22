import { API_URL } from "./config.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app, db } from "./firebaseConfig.js";
import { collection, addDoc, getDocs, setDoc } from "firebase/firestore";

export const getBotResponse = async function (prompt) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();
      return parsedData;
    } else {
      const err = await response.text();
      console.error(err);
      throw err;
    }
  } catch (err) {
    // Catching errors if we cannot connect to the server
    throw `The connection to the server failed. ${err}`;
  }
};

export const signInWithGoogle = function () {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(user.uid);
      // IdP data available using getAdditionalUserInfo(result)

      const dd = async function () {
        const docRef = await setDoc(doc(db, "users", `${user.uid}`), data);
        console.log("Document written with ID: ", docRef.id);
      };
      dd();
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

const dd = async function () {
  const docRef = await addDoc(collection(db, "users"), {
    name: "Tokyo",
    country: "Japan",
  });
  console.log("Document written with ID: ", docRef.id);
};
// dd();
