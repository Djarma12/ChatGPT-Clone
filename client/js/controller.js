import * as model from "./model.js";
import AuthWithListener from "./model.js";
import * as helpers from "./helpers.js";
import ChatView from "./views/chatView.js";
import DbView from "./views/dbView.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const formChat = ChatView.form;
const listView = ChatView.listView;
let isSubmitting = false; // With this variable we disable sending a prompt to the server until the response is completed
let userFB;
let btnLogInOut = document.querySelector(".sidebar__login");

const auth = getAuth();

//////////////////////////////////////////
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userFB = new AuthWithListener(user);
    await userFB.getAllPosts();
    DbView.renderAllPosts(userFB.allPostsColId);
    DbView.handleActivePosts(handleActivePosts);

    DbView.logInOut(btnLogInOut, true);
  } else {
    DbView.logInOut(btnLogInOut, false);
    DbView.clearSidebarForm();
    ChatView.clearChat();
    console.log("no");
  }
});

const handleSubmit = async (e) => {
  e.preventDefault();
  // Get input text
  const prompt = new FormData(formChat).get("prompt");

  // If prompt don't exist, stop function
  if (prompt === "" || isSubmitting) {
    return;
  }
  isSubmitting = true;

  ChatView.renderBotResponse(prompt, "user");
  ChatView.clearInput();

  try {
    console.log(userFB);
    const botResponsePromise = model.getBotResponse(prompt);
    const timerPromise = helpers.timerPromise(
      botResponsePromise,
      ChatView,
      listView
    );

    const parsedData = await Promise.race([botResponsePromise, timerPromise]);
    // const parsedData = "Parsed data";
    // console.log(parsedData);
    if (userFB) {
      console.log(parsedData);
      console.log(prompt);
      const obj = { prompt: prompt, parsedData: parsedData };
      if (userFB.activeCollectionId === "newchat") {
        await userFB.addCollection(obj);
        DbView.renderSinglePosts(userFB.idNameCollection);
      } else {
        await userFB.addDocument(obj);
      }
    }
    await ChatView.renderBotResponse(parsedData);
    // Wait for the data to be printed so that the user cannot start the handleSubmit function again
    isSubmitting = false;
  } catch (err) {
    isSubmitting = false;
    ChatView.alertError(`${err}`);
  }
};

formChat.addEventListener("submit", handleSubmit);
formChat.querySelector("#input-icon").addEventListener("click", handleSubmit);

window.addEventListener("load", helpers.scrollTop(listView));

// Handle active posts here and displayed them all
const handleActivePosts = async function (id) {
  // console.log("Active posts ID:", id);
  await userFB.getData(id);
  ChatView.clearChat();
  userFB.dataSinglePost.forEach((obj) => {
    ChatView.renderBotResponse(obj.prompt, "user");
    ChatView.renderBotResponse(obj.parsedData, "parsedData");
  });
};

document
  .querySelector(".sidebar__login")
  .addEventListener("click", async (e) => {
    console.log(e.target.textContent);
    try {
      if (e.target.textContent === "Log in") {
        await model.signInWithGoogle();
      } else {
        await model.singOutWithGoogle();
      }
    } catch (err) {
      ChatView.alertError(err);
    }
  });

document.querySelector(".form__list").addEventListener("click", async (e) => {
  if (e.target.closest(".form__delete") && userFB) {
    e.preventDefault();
    const dataIndex = e.target.closest(".form__item");
    const id = dataIndex.querySelector(".form__radio").id;
    const labelText = dataIndex.querySelector(".form__label").textContent;
    await userFB.deleteCollection({ id: id, namecollection: labelText });
    DbView.deleteActivePosts(dataIndex);
    ChatView.clearChat();
  }
});
