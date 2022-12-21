const express = require("express");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const axios = require("axios");
const path = require("path");
const {
	loadNotifications,
	addNotification,
	deleteNotification,
	getExchanges,
	getExchangeNotifications,
} = require("./server/database/database");

const { sendNotification } = require("./server/telegram/telegram");

const { getMarkets } = require("./server/exchanges/exchanges");

let allMarkets; // Map of all exchanges. exchange_name -> {instance,pairs}
let allExchanges; // Aray of all exchange names
let markets; // Array of exchange_name and pairs [{exchange_name,pairs}]

const app = express();
const PORT = process.env.PORT || 3000;

// Handlebars middleware
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// parse request to body-parser
app.use(bodyParser.json());

// load assets
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));

app.get("/", async (req, res) => {
	const notifications = await loadNotifications();
	allExchanges = (await getMarkets)["allExchanges"];
	// allMarkets = (await getMarkets)["allMarkets"];
	markets = loadMarkets();

	console.log("Loading markets");
	res.render("home", { notifications, markets });
});

app.post("/", async (req, res, next) => {
	const exchange = req.body.exchange;
	const symbol = req.body.pair;
	const direction = req.body.direction;
	const price = Number(req.body.price);

	if (
		allExchanges.includes(exchange) &&
		allMarkets.get(exchange)["markets"].includes(symbol) &&
		(direction === "UP" || direction === "DOWN") &&
		price > 0
	) {
		const newNotification = {
			exchange: exchange,
			symbol: symbol,
			direction: direction,
			price: price,
		};

		await addNotification(newNotification);
		console.log("Notification added!");
	}

	const notifications = await loadNotifications();
	res.render("home", { notifications, markets });
});

app.delete("/", async (req, res) => {
	await deleteNotification(req.body.id);

	const { notifications, markets } = await loadNotifications();
	res.render("home", { notifications, markets });
});

app.listen(PORT, async () => {
	console.log("Getting all markets, it may take a few minutes...");
	allMarkets = (await getMarkets)["allMarkets"];
	console.log(`Server is running on http://localhost:${PORT}`);
	await check();
});

function loadMarkets() {
	const markets = [];
	allMarkets.forEach((value, key) => {
		markets.push({
			exchange: key,
			markets: value["markets"],
		});
	});

	return markets;
}

async function check() {
	console.log("Fetching notifications...");
	const notifications = await loadNotifications();
	const notExchanges = getExchanges(notifications);

	let allTickers;

	console.log("Checking notifications...");

	if (notifications && notifications.length > 0 && allMarkets) {
		for (let i = 0; i < notExchanges.length; i++) {
			const { exchangeNotifications, symbols } = getExchangeNotifications(
				notifications,
				notExchanges[i]
			);

			const exchange = allMarkets.get(notExchanges[i])["instance"];
			try {
				allTickers = await exchange.fetchTickers(symbols);
			} catch (err) {
				console.log(err);
			}

			if (allTickers) {
				for (let j = 0; j < exchangeNotifications.length; j++) {
					const ticker = allTickers[exchangeNotifications[j]["symbol"]];

					if (ticker) {
						switch (exchangeNotifications[j]["direction"]) {
							case "UP":
								if (ticker["last"] >= exchangeNotifications[j]["price"]) {
									await deleteNotification(exchangeNotifications[j]["id"]);
									sendNotification(exchangeNotifications[j]);
									console.log(`${ticker["symbol"]} Price crossing up`);
								}
								break;
							case "DOWN":
								if (ticker["last"] <= exchangeNotifications[j]["price"]) {
									await deleteNotification(exchangeNotifications[j]["id"]);
									sendNotification(exchangeNotifications[j]);
									console.log(`${ticker["symbol"]} Price crossing down`);
								}
								break;
						}
					}
				}
			}
		}
	}

	setTimeout(async () => {
		await check();
	}, 1000);
}
