import { TIMEOUT_SEC } from "./config.js";
////////////////////////////
// CONTROLLER
// Scroll to the bottom chat content
export const scrollTop = function (listView) {
  listView.scrollTop = listView.scrollHeight;
};

export const timerPromise = function (botResponsePromise, ChatView, listView) {
  ChatView.renderBotResponse(".", "thinking");
  scrollTop(listView);
  let counter = 1;

  // Timer for three dot
  const timer = setInterval(() => {
    counter++;
    if (counter > 3) counter = 0;
    ChatView.loadingBotResponse(counter);
    console.log(counter);
  }, 320);

  // Add a 10-second timeout
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      clearInterval(timer);
      console.log("Timeout waiting for bot response");
      reject(
        "The server is not responding at the moment. Please try again later."
      );
    }, TIMEOUT_SEC * 1000);
  });

  return Promise.race([botResponsePromise, timeoutPromise])
    .then(() => {
      clearInterval(timer);
    })
    .catch((error) => {
      clearInterval(timer);
      throw `Error receiving bot response: ${error}`;
    });
};

////////////////////////////
// CHATVIEW
// Checking the index in ChatView.renderBotResponse method
export const checkIndex = function (index) {
  return index === "user" ? "user.svg" : "bot.svg";
};
