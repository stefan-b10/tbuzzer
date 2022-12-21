const ccxt = require("ccxt");

// Create a map of all available exchanges. Initialise exchange instance and get available pairs
const getMarkets = (async function () {
	const allMarkets = new Map();
	const allExchanges = ccxt.exchanges;
	// const allExchanges = ["binance", "deribit", "bitmex", "poloniex"];

	for (let i = 0; i < allExchanges.length; i++) {
		const exchangeInstance = new ccxt[allExchanges[i]]();

		try {
			await exchangeInstance.loadMarkets();
		} catch (err) {}

		const markets = exchangeInstance.symbols;

		if (markets && exchangeInstance["has"]["fetchTickers"]) {
			allMarkets.set(allExchanges[i], {
				instance: exchangeInstance,
				markets: markets,
			});
		}
	}
	return { allExchanges, allMarkets };
})();

module.exports = { getMarkets };
