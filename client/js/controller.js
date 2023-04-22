import * as model from "./model.js";
import * as helpers from "./helpers.js";
import ChatView from "./views/chatView.js";

const form = ChatView.form;
const listView = ChatView.listView;
let isSubmitting = false;

const handleSubmit = async (e) => {
  e.preventDefault();
  // Get input text
  const prompt = new FormData(form).get("prompt");

  // If prompt don't exist, stop function
  if (prompt === "" || isSubmitting) {
    return;
  }
  isSubmitting = true;

  ChatView.renderBotResponse(prompt, "user");
  ChatView.clearInput();

  try {
    const botResponsePromise = model.getBotResponse(prompt);
    const timerPromise = helpers.timerPromise(
      botResponsePromise,
      ChatView,
      listView
    );

    const parsedData = await Promise.race([botResponsePromise, timerPromise]);
    console.log(parsedData);
    // Wait for the data to be printed so that the user cannot start the handleSubmit function again
    await ChatView.renderBotResponse(parsedData);
    isSubmitting = false;
  } catch (err) {
    isSubmitting = false;
    ChatView.alertError(`${err}`);
  }
};

form.addEventListener("submit", handleSubmit);
form.querySelector("#input-icon").addEventListener("click", handleSubmit);

window.addEventListener("load", helpers.scrollTop(listView));

document
  .querySelector(".login")
  .addEventListener("click", model.signInWithGoogle);

if (module.hot) {
  module.hot.accept();
}
