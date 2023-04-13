import * as helpers from "../helpers.js";

class ChatView {
  // An element which, after thinking by the AI, shows the answer, and thinking and showing the answer is used with this element
  thinkingLi;
  constructor() {
    this.form = document.querySelector("form");
    this.listView = document.querySelector(".list");
  }

  renderBotResponse(parsedData, dataIndex = "gpt") {
    this.thinkingLi = Array.from(this.listView.children).pop();
    if (dataIndex === "thinking" || dataIndex === "user") {
      const html = `
        <li class="list__item" data-index=${dataIndex}>
          <div class="list__content">
            <img src="assets/${helpers.checkIndex(dataIndex)}" 
            class="list__content-icon" alt="SVG image">
            <p>${parsedData}</p>
          </div>
        </li>`;
      this.listView.insertAdjacentHTML("beforeend", html);
    } else {
      // Change index from last li element "thinking" to "gpt"
      this.thinkingLi.dataset.index = "gpt";
      this.thinkingLi.querySelector("p").textContent = "";
      this.setIntervalText(parsedData);
    }
  }

  // Displaying text letter by letter
  setIntervalText(parsedData) {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < parsedData.length) {
        const letter = parsedData.charAt(index);
        this.thinkingLi.querySelector("p").textContent += letter;
        index++;
        helpers.scrollTop(this.listView);
      } else {
        console.log(this);
        clearInterval(intervalId);
      }
    }, 13);
  }

  loadingBotResponse(counter) {
    Array.from(this.listView.children).pop().querySelector("p").innerHTML =
      ".".repeat(counter);
  }

  alertError(err) {
    alert(err);
  }
}

export default new ChatView();
