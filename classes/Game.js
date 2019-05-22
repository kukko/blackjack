let Player = require("./Player.js"),
	Card = require("./Card.js");

class Game{
	constructor(name, dealerStopAt = 15, openTime = 15, numberOfAI = 1){
		this._started = new Date();
		this._players = [];
		this.addAIs(numberOfAI);
		this._name = name;
		this._dealerStopAt = dealerStopAt;
		this._openTime = openTime;
		this._currentPlayer = 0;
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
	get currentPlayer(){
		return this._currentPlayer;
	}
	set currentPlayer(value){
		this._currentPlayer = value;
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
	dealCard(){
		this.players[this.currentPlayer].giveCard(this.drawCard());
		if (this.players[this.currentPlayer].isBusted() || this.players[this.currentPlayer].stopped){
			this.stepPlayer();
		}
	}
	drawCard(){
		let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
			colors = ["♠", "♥", "♦", "♣"],
			pickedValue = values[Math.floor(Math.random() * values.length)],
			pickedColor = colors[Math.floor(Math.random() * colors.length)];
		return new Card(pickedValue, pickedColor);
	}
	stepPlayer(){
		this.currentPlayer++;
		if (this.currentPlayer >= this.players.length){
			this.currentPlayer = 0;
		}
	}
}

module.exports = Game;