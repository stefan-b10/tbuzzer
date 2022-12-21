const dotenv = require("dotenv");
const axios = require("axios");
// const fetch = require("node-fetch");

dotenv.config();

const token = process.env.TOKEN;
const chatId = process.env.CHAT_ID;

function sendNotification(notification) {
	const date = new Date().toUTCString();

	const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${date} %0A${notification["exchange"]} - ${notification["symbol"]} - ${notification["price"]} - ${notification["direction"]}`;
	axios.get(url);
}

module.exports = { sendNotification };
