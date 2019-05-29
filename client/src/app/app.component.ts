import { Component } from '@angular/core';
import Player from '../classes/Player';
import Room from '../classes/Room';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';
	loginData:Player = new Player("");
	player:Player = null;
	room:Room = null;
	players:Player[] = [];
	webSocket:WebSocket;
	login(){
		this.webSocket = new WebSocket("ws://localhost:8888/game");
		this.webSocket.onopen = (event) => {
			this.webSocket.send(JSON.stringify({
				method: "login",
				data: {
					name: this.loginData.name
				}
			}));
		};
		this.webSocket.onmessage = (event) => {
			let message = JSON.parse(event.data);
			this[message.method](message.data);
		};
	}
	joinGame(data){
		console.log(data);
		this.player = this.createPlayerFromLoginData();
		this.joinRoom(data.gameName);
		this.setPlayers(data.players);
	}
	createPlayerFromLoginData(){
		let output = new Player(this.loginData.name);
		this.resetLoginData();
		return output;
	}
	resetLoginData(){
		this.loginData = new Player("");
	}
	joinRoom(roomName){
		this.room = new Room(roomName);
	}
	setPlayers(players){
		this.players = [];
		this.addPlayers(players);
	}
	addPlayers(players){
		for (let playerIndex in players){
			this.addPlayer(players[playerIndex]);
		}
	}
	addPlayer(player){
		this.players.push(player);
	}
	cardDrawed(data){
		this.setPlayers(data.players)
	}
	playerJoined(data){
		this.addPlayer(new Player(data.name, data.point));
	}
	getPlayerByName(playerName){
		for (let playerIndex in this.players){
			let player = this.players[playerIndex];
			if (player.name === playerName){
				return player;
			}
		}
	}
	askForCard(){
		this.sendMessage("askForCard");
	}
	sendMessage(method, data = {}){
		this.webSocket.send(JSON.stringify({
			method,
			data
		}));
	}
	stop(){
		this.sendMessage("stop");
	}
	getCardColor(card){
		return {
			"text-black": ["♠", "♣"].includes(card._color),
			"text-red": ["♥", "♦"].includes(card._color)
		};
	}
}
