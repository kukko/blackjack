let Player = require("./Player.js");

class Game{
	constructor(openTime = 15){
		this._started = new Date();
		this._players = [];
		this._openTime = openTime;
	}
	get started(){
		return this._started;
	}
	get players(){
		return this._players;
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
}

module.exports = Game;