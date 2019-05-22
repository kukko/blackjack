document.addEventListener("DOMContentLoaded", (e) => {
	document.getElementById("loginForm").addEventListener("submit", (e) => {
		e.preventDefault();
		let nameInput = e.target.querySelector("[name=name]"),
			name = nameInput.value;
		e.target.querySelector("input").disabled = true;
		e.target.querySelector("button").disabled = true;
		let webSocket = new WebSocket("ws://localhost:8888/game");
		webSocket.onopen = (event) => {
			webSocket.send(JSON.stringify({
				method: "login",
				data: {
					name: name
				}
			}));
		};
		webSocket.onmessage = (event) => {
			console.log(event.data);
		};
	});
});