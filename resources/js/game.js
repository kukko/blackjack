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
	static cardDrawed(data){
		getMovesContainer().style.display = "block";
		for (let playerIndex in data.players){
			let player = data.players[playerIndex];
			this.findPlayersPointField(player.name).innerHTML = player.point;
		}
	}
	static findPlayersPointField(name){
		let playerRows = getPlayersList().querySelectorAll("tr");
		for (let playerIndex in playerRows){
			let playerRow = playerRows[playerIndex],
				playerNameField = playerRow.querySelector("td");
			if (playerNameField.innerHTML === name){
				return playerNameField.nextSibling;
			}
		}
	}
}
function getLoginForm(){
	return document.getElementById("loginForm");
}
function getNameInput(){
	return document.querySelector("[name=name]");
}
function getPlayersTable(){
	return document.querySelector("#players");
}
function getPlayersList(){
	return getPlayersTable().querySelector("tbody");
}
function getMovesContainer(){
	return document.getElementById("moves");
}
function getAskForCardButton(){
	return document.getElementById("askForCard");
}
function getStopButton(){
	return document.getElementById("stop");
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
	getPlayersList().appendChild(playerRow);
}
document.addEventListener("DOMContentLoaded", (e) => {
	let webSocket;
	getLoginForm().addEventListener("submit", (e) => {
		e.preventDefault();
		let nameInput = getNameInput(),
			name = nameInput.value;
		enableOrDisableLoginForm(true);
		webSocket = new WebSocket("ws://localhost:8888/game");
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
	getAskForCardButton().addEventListener("click", (e) => {
		webSocket.send(JSON.stringify({
			method: "askForCard"
		}));
	});
	getStopButton().addEventListener("click", (e) => {
		webSocket.send(JSON.stringify({
			method: "stop"
		}));
	});
});