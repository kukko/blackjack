let Game = require("../Game.js");

class GameService{
	static get games(){
		if (typeof this._games === "undefined"){
			this._games = [];
		}
		return this._games;
	}
	static findGame(){
		let output;
		for (let gameIndex in this.games){
			if (this.games[gameIndex].canJoin()){
				output = this.games[gameIndex];
				break;
			}
		}
		if (typeof output === "undefined"){
			output = this.createGame();
		}
		return output;
	}
	static createGame(){
		let game = new Game(this.generateGameName());
		this.games.push(game);
		return game;
	}
	static generateGameName(){
		return "#" + (this.games.length + 1);
	}
	static joinGame(connectionId, playerName){
		return this.findGame().addPlayer(connectionId, playerName);
	}
	static findPlayersGame(connectionId){
		for (let gameIndex in this.games){
			let game = this.games[gameIndex];
			if (game.playerIsInGame(connectionId)){
				return game;
			}
		}
	}
}

module.exports = GameService;