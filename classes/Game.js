let Player = require("./Player.js");

class Game{
	constructor(name, dealerStopAt = 15, openTime = 15, numberOfAI = 1){
		this._started = new Date();
		this._players = [];
		this.addAIs(numberOfAI);
		this._name = name;
		this._dealerStopAt = dealerStopAt;
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
	get dealerStopAt(){
		return this._dealerStopAt;
	}
	get openTime(){
		return this._openTime;
	}
	addAIs(numberOfAIs){
		for (let i = 0; i < numberOfAIs; i++){
			this.players.push(new Player("", this.generateAIName(i + 1), true));
		}
	}
	generateAIName(numberOfAI){
		return "AI #" + numberOfAI;
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