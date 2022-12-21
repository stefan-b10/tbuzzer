const exchangeMenu = document.getElementById("exchange");
const pairMenu = document.getElementById("pair");
const addNotification = document.getElementById("submit");
const deleteNotification = document.getElementsByName("delete");

exchangeMenu.onchange = () => {
	pairMenu.innerHTML = "<option id='p-option'>Select Pair</option>";
	const pairs = JSON.stringify(exchangeMenu.value);
	const exchange = pairs.split("	")[0].slice(1);
	const markets = pairs
		.slice(pairs.indexOf("[") + 1, pairs.length - 2)
		.split(",");
	if (markets.length > 1) {
		markets.forEach((el) => {
			const option = document.createElement("option");
			option.text = el;
			option.value = el;
			pairMenu.appendChild(option);
		});
	}
};

addNotification.onclick = function () {
	const e = document.getElementById("exchange");
	const p = document.getElementById("pair");
	const d = document.getElementById("direction");
	const pr = document.getElementById("price");

	const data = {
		exchange: e.value.substring(0, e.value.indexOf(" ")),
		pair: p.options[p.selectedIndex].text,
		direction: d.options[d.selectedIndex].value,
		price: pr.value,
	};

	fetch(`http://localhost:3000/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// 'Content-Type': 'application/x-www-form-urlencoded',}
		},
		body: JSON.stringify(data),
	});

};

deleteNotification.forEach((el) => {
	el.onclick = async (event) => {
		const data = { id: el.value };

		await fetch(`http://localhost:3000/`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				// 'Content-Type': 'application/x-www-form-urlencoded',}
			},
			body: JSON.stringify(data),
		});
		window.alert("Notification deleted!");
	};
});


function loadNotifications() {
	const exchange = document.getElementById("n-exchange");
}
