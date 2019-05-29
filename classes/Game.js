let Player = require("./Player.js"),
	Card = require("./Card.js");

class Game{
	constructor(name, dealerStopAt = 15, openTime = 15, numberOfAI = 1){
		this._started = new Date();
		this._name = name;
		this._dealerStopAt = dealerStopAt;
		this._players = [];
		this.addAIs(numberOfAI);
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
			this.players.push(new Player("", this.generateAIName(i + 1), true, this.dealerStopAt));
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
	dealCards(numberOfCards = 1){
		this.startNewRound();
		for (let i = 0; i < numberOfCards; i++){
			for (let playerIndex in this.players){
				let player = this.players[playerIndex];
				if (!player.isBusted() && !player.stopped){
					player.giveCard(this.drawCard());
				}
			}
		}
	}
	startNewRound(){
		for (let playerIndex in this.players){
			this.players[playerIndex].startNewRound();
		}
	}
	drawCard(){
		let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
			colors = ["♠", "♥", "♦", "♣"],
			pickedValue = values[Math.floor(Math.random() * values.length)],
			pickedColor = colors[Math.floor(Math.random() * colors.length)];
		return new Card(pickedValue, pickedColor);
	}
	playerAskForCard(connectionId){
		this.findPlayerWithConnectionId(connectionId).requestCard();
	}
	playerStopped(connectionId){
		this.findPlayerWithConnectionId(connectionId).stop();
	}
	playerIsInGame(connectionId){
		return typeof this.findPlayerWithConnectionId(connectionId) !== "undefined";
	}
	roundIsFinished(){
		for (let playerIndex in this.players){
			if (!this.players[playerIndex].isAI && !this.players[playerIndex].decided()){
				return false;
			}
		}
		return true;
	}
	gameIsEnded(){
		for (let playerIndex in this.players){
			let player = this.players[playerIndex];
			if (!player.isBusted() && !player.stopped){
				return false;
			}
		}
		return true;
	}
	getWinners(){
		let output = [];
		if (this.gameIsEnded()){
			let playersWithHighestPoint = this.getPlayersWithHighestPoint(),
				isThereAI = this.isThereAI(playersWithHighestPoint);
			if (isThereAI){
				output = this.getAIs(playersWithHighestPoint);
			}
			else{
				output = playersWithHighestPoint;
			}
		}
		return output;
	}
	getHighestPoint(){
		let output = 0;
		for (let playerIndex in this.players){
			let player = this.players[playerIndex],
				valueOfHand = player.valueOfHand();
			if (valueOfHand > output && valueOfHand <= 21){
				output = valueOfHand;
			}
		}
		return output;
	}
	getPlayersWithHighestPoint(){
		let output = [],
			highestPoint = this.getHighestPoint();
		for (let playerIndex in this.players){
			let player = this.players[playerIndex];
			if (player.valueOfHand() === highestPoint){
				output.push(player);
			}
		}
		return output;
	}
	isThereAI(players){
		for (let playerIndex in players){
			if (players[playerIndex].isAI){
				return true;
			}
		}
		return false;
	}
	getAIs(players){
		let output = [];
		for (let playerIndex in players){
			let player = players[playerIndex];
			if (player.isAI){
				output.push(player);
			}
		}
		return output;
	}
}

module.exports = Game;