import { API_URL } from "./config.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { app, db } from "./firebaseConfig.js";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";

const usersRef = collection(db, "users");

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
    console.error("Request Error:", err);
    // Catching errors if we cannot connect to the server
    throw `The connection to the server failed. ${err}`;
  }
};

export const signInWithGoogle = async function () {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)

    const userDocRef = doc(usersRef, user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      await setDoc(userDocRef, {
        id: user.uid,
      });
    }
  } catch (error) {
    throw error;
  }
};

export const singOutWithGoogle = function () {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("Sign-out successful.");
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
      throw error;
    });
};

export default class AuthWithListener {
  user;
  allPostsCol;
  allPostsColId = [];
  singlePost;
  dataSinglePost = [];

  activeCollectionId = "newchat";
  idNameCollection;
  constructor(user) {
    this.user = user;
    this.allPostsCol = doc(db, "users", user.uid);
  }

  async updateIdCollections(newId) {
    await updateDoc(this.allPostsCol, {
      id: arrayUnion(newId),
    });
  }

  async getAllPosts() {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      if (doc.id === this.user.uid) {
        console.log(doc.id, " => ", doc.data());
        this.allPostsColId.push(doc.data());
      }
    });
    console.log(this.allPostsColId);
  }

  // Get data from one post
  async getData(idCollection) {
    this.activeCollectionId = idCollection;
    this.dataSinglePost = [];
    this.singlePost = collection(db, "users", this.user.uid, `${idCollection}`);
    this.singlePost = await getDocs(this.singlePost);

    this.singlePost.forEach((doc) => {
      // this.dataSinglePost.push({ id: doc.id, content: doc.data() });
      console.log(doc.data());
      this.dataSinglePost.push(doc.data());
      // console.log(doc.id, " => ", doc.data());
    });
    this.dataSinglePost?.reverse();
    console.log(this.dataSinglePost);
  }

  async addCollection(obj) {
    console.log(this.user);
    this.activeCollectionId = Date.now().toString();
    console.log(`${this.activeCollectionId}`);
    const userRef = doc(db, "users", this.user.uid); // replace 'user-id' with the actual user ID
    const subCollectionRef = collection(userRef, `${this.activeCollectionId}`);
    await addDoc(subCollectionRef, obj);
    this.idNameCollection = {
      id: this.activeCollectionId,
      namecollection: obj.prompt,
    };
    console.log(this.idNameCollection);
    this.updateIdCollections(this.idNameCollection);
  }

  async addDocument(obj) {
    const reviewRef = doc(
      collection(db, "users", this.user.uid, this.activeCollectionId)
    );
    await setDoc(reviewRef, obj);
  }

  // async updateField(obj) {
  //   const washingtonRef = doc(db, "users", this.user.uid, "posts", "post");
  //   // Set the "capital" field of the city 'DC'
  //   await updateDoc(washingtonRef, obj);
  // }

  async deleteCollection(obj) {
    // Delete subcollection
    const postsRef = collection(db, "users", this.user.uid, `${obj.id}`);
    const querySnapshot = await getDocs(postsRef);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    console.log("Subcollection deleted successfully.");

    // Remove the deleted subcollection from the id array in the user document
    const userRef = doc(db, "users", this.user.uid);

    // Get the current user document data
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    console.log(userData.id);
    // Find the index of the object to be deleted in the id array
    const index = userData.id.findIndex((item) => item.id === obj.id);
    console.log(index);
    if (index >= 0) {
      // Remove the object from the id array
      userData.id.splice(index, 1);

      // Update the user document with the modified id array
      await updateDoc(userRef, {
        id: userData.id,
      });

      this.activeCollectionId = "newchat";
      console.log("User field updated successfully.");
    } else {
      console.log("Object not found in the id array.");
    }
  }
}
