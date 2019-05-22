class Client{
	static joinGame(data){
		document.getElementById("loginForm").style.display = "none";
		document.getElementById("playerName").innerHTML = getNameInput().value;
		getNameInput().value ="";
		document.getElementById("roomName").innerHTML = data.gameName;
		getPlayersTable().style.display = "table";
		for (let playerIndex in data.players){
			playerJoin(data.players[playerIndex].name, data.players[playerIndex].point);
		}
	}
	static playerJoined(data){
		playerJoin(data.name, data.point);
	}
}
function getLoginForm(){
	return document.getElementById("loginForm");
}
function getNameInput(){
	return document.querySelector("[name=name]");
}
function getPlayersTable(){
	return document.getElementById("players");
}
function enableOrDisableLoginForm(disabled){
	getLoginForm().querySelector("input").disabled = disabled;
	getLoginForm().querySelector("button").disabled = disabled;
}
function playerJoin(name, point){
	let playerRow = document.createElement("tr"),
		playerNameCol = document.createElement("td"),
		playerPointCol = document.createElement("td");
	playerNameCol.innerHTML = name;
	playerPointCol.innerHTML = point;
	playerRow.appendChild(playerNameCol);
	playerRow.appendChild(playerPointCol);
	getPlayersTable().appendChild(playerRow);
}
document.addEventListener("DOMContentLoaded", (e) => {
	getLoginForm().addEventListener("submit", (e) => {
		e.preventDefault();
		let nameInput = getNameInput(),
			name = nameInput.value;
		enableOrDisableLoginForm(true);
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
			let message = JSON.parse(event.data);
			Client[message.method](message.data);
		};
	});
});