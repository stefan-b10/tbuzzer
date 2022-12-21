const fs = require("fs");

const path = "server/database/db.json";

function getId() {
	return "_" + Math.random().toString(36).substr(2, 9);
}

async function updateDb(notifications) {
	const fd = fs.openSync(path);
	fs.writeFileSync(path, JSON.stringify(notifications));
	fs.closeSync(fd);
}

function loadNotifications() {
	if (!fs.existsSync(path)) {
		fs.closeSync(fs.openSync(path, "w"));
		return [];
	} else {
		const fd = fs.openSync(path);
		const db = fs.readFileSync(path, "utf-8");
		fs.closeSync(fd);
		if (db) {
			// console.log(db.length);
			return JSON.parse(db);
		} else return [];
	}
}

async function addNotification(notification) {
	const allNotifications = await loadNotifications();
	notification.id = getId();
	allNotifications.push(notification);

	await updateDb(allNotifications);
	return allNotifications;
}

async function deleteNotification(id) {
	const allNotifications = await loadNotifications();
	const index = await allNotifications.findIndex((el) => el["id"] === id);
	if (index >= 0) allNotifications.splice(index, 1);

	await updateDb(allNotifications);
	return allNotifications;
}

// Return all different exchanges from active notifications
function getExchanges(notifications) {
	const exchanges = [];

	notifications.forEach((el) => {
		if (!exchanges.includes(el.exchange)) {
			exchanges.push(el["exchange"]);
		}
	});

	return exchanges;
}

// Return a array of all notifications for a exchange and a array of all symbols for same exchange
function getExchangeNotifications(allNotifications, exchange) {
	const exchangeNotifications = [];
	const symbols = [];

	allNotifications.forEach((el) => {
		if (el["exchange"] === exchange) {
			exchangeNotifications.push(el);
			if (!symbols.includes(el["symbol"])) {
				symbols.push(el["symbol"]);
			}
		}
	});

	return { exchangeNotifications, symbols };
}

module.exports = {
	loadNotifications,
	addNotification,
	deleteNotification,
	getExchanges,
	getExchangeNotifications,
};
