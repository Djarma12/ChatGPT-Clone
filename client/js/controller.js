import * as model from "./model.js";
import * as helpers from "./helpers.js";
import ChatView from "./views/ChatView.js";

const form = ChatView.form;
const listView = ChatView.listView;

const handleSubmit = async (e) => {
  e.preventDefault();
  // Get input text
  const prompt = new FormData(form).get("prompt");
  ChatView.renderBotResponse(prompt, "user");

  try {
    const botResponsePromise = model.getBotResponse(prompt);
    const timerPromise = helpers.timerPromise(
      botResponsePromise,
      ChatView,
      listView
    );

    const parsedData = await Promise.race([botResponsePromise, timerPromise]);
    console.log(parsedData);
    ChatView.renderBotResponse(parsedData);
    helpers.scrollTop(listView);
  } catch (err) {
    ChatView.alertError(`${err}`);
  }
};

form.addEventListener("submit", handleSubmit);

window.addEventListener("load", helpers.scrollTop(listView));

// const timerPromise = function (botResponsePromise) {
//   ChatView.renderBotResponse(".", "thinking");
//   helpers.scrollTop(listView);
//   let counter = 1;

//   // Timer for three dot
//   const timer = setInterval(() => {
//     counter++;
//     if (counter > 3) counter = 0;
//     ChatView.loadingBotResponse(counter);
//     console.log(counter);
//   }, 320);

//   // Add a 10-second timeout
//   const timeoutPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       clearInterval(timer);
//       console.log("Timeout waiting for bot response");
//       reject("Waited too long for a response from the server.");
//     }, 10 * 1000);
//   });

//   return Promise.race([botResponsePromise, timeoutPromise])
//     .then(() => {
//       clearInterval(timer);
//     })
//     .catch((error) => {
//       clearInterval(timer);
//       throw `Error receiving bot response: ${error}`;
//     });
// };
