let Player = require("./Player.js");

class Game{
	constructor(name, openTime = 15){
		this._started = new Date();
		this._players = [];
		this._name = name;
		this._openTime = openTime;
	}
	get started(){
		return this._started;
	}
	get players(){
		return this._players;
	}
	get name(){
		return this._name;
	}
	get openTime(){
		return this._openTime;
	}
	canJoin(){
		return (new Date() - this.started) / 1000 <= this.openTime;
	}
	addPlayer(connectionId, name){
		this.players.push(new Player(connectionId, name));
		return this;
	}
	findPlayerWithConnectionId(connectionId){
		for (let playerIndex in this.players){
			if (this.players[playerIndex].connectionId === connectionId){
				return this.players[playerIndex];
			}
		}
	}
}

module.exports = Game;