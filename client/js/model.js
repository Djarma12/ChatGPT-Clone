import { API_URL } from "./config.js";

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
