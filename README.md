# Chat GPT Clone

Chat GPT application with user data storage.

You can view the project live here:
[Chat GPT Clone](https://chat-gpt-clone-app.netlify.app/)

---

### Table of Contents

- [Description](#description)
- [Getting Started](#getting-started)
- [References](#references)

---

## Description

- The ChatGPT Clone App is a feature-rich application built with HTML, SCSS, and JavaScript. It follows the MVC architecture and employs OOP principles for scalability and code reusability.

- Users can securely log in to the app, which utilizes Firebase Firestore for data storage. The app seamlessly integrates with the OpenAI API, leveraging the ChatGPT model for natural language processing.

- In summary, the ChatGPT Clone App combines HTML, SCSS, and JavaScript to create a powerful chat application. It implements the MVC architecture and OOP principles for scalability. The app integrates Firebase Firestore for data storage and retrieval, and leverages the OpenAI API for natural language processing, resulting in an intuitive and interactive user experience.

### Technologies

- HTML
- SCSS
- JS (REST-API, OOP)

[Back To The Top](#chat-gpt-clone)

---

## Getting Started

To start the project, it is necessary to download the files from the github, after that you most install npm.

### Instalation

- In client folder: <br>`npm install` <br> `npm run str`
- In server folder: <br>`npm install` <br> `npm run server` <br> (In the server directory you need to enter your OpenAI key through which you will be able to send the prompt. Create a .env file and enter in it: OPENAI_API_KEY="your key"
  )

[Back To The Top](#chat-gpt-clone)

---

## References

You can see the documentation for the OpenAI api here: [OpenAI platfom](https://platform.openai.com/docs/introduction)

Also, you can see the documentation for the Firebase here: [Firebase](https://firebase.google.com/docs)

### API References

- This function sends a prompt to the server, after which it receives a response from 'text-davinci-003':<br>
  `export const getBotResponse = async function (prompt) {...};`

- Through this function, the user logs in to firebase, using a google popup, and all the data of that user is displayed:
  <br>
  `export const signInWithGoogle = async function () {...};`

[Back To The Top](#chat-gpt-clone)
