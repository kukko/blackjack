let { WebSocketController } = require("web-wombat"),
	GameService = require("../../classes/services/GameService.js");

class GameController extends WebSocketController{
	onMessage(message){
		message = JSON.parse(message);
		this[message.method](message.data);
	}
	login(data){
		let game = GameService.joinGame(this.uuid, data.name);
		this.setNextStep(game);
		this.notifyOtherPlayers(game);
		this.send(JSON.stringify({
			method: "joinGame",
			data: {
				gameName: game.name,
				players: this.getPlayersSendableData(game.players)
			}
		}));
	}
	getPlayersSendableData(players){
		let output = [];
		for (let playerIndex in players){
			let player = players[playerIndex];
			output.push({
				name: player.name,
				point: player.valueOfHand()
			});
		}
		return output;
	}
	notifyOtherPlayers(game){
		let me = game.findPlayerWithConnectionId(this.uuid);
		for (let playerIndex in game.players){
			let player = game.players[playerIndex];
			if (!player.isAI && player.connectionId !== this.uuid){
				this.sendTo(player.connectionId, JSON.stringify({
					method: "playerJoined",
					data: {
						name: me.name,
						point: me.valueOfHand()
					}
				}));
			}
		}
	}
	setNextStep(game){
		if (typeof game.gameStarter === "undefined"){
			game.gameStarter = setTimeout(() => {
				game.dealCards(2);
				this.broadcastPoints(game);
			}, game.openTime * 1000);
		}
	}
	broadcastPoints(game){
		this.broadcast(JSON.stringify({
			method: "cardDrawed",
			data: {
				players: this.getPlayersSendableData(game.players)
			}
		}));
	}
	broadcast(message){
		let game = GameService.findPlayersGame(this.uuid);
		for (let playerIndex in game.players){
			let player = game.players[playerIndex];
			if (!player.isAI){
				this.sendTo(player.connectionId, message);
			}
		}
	}
	askForCard(){
		let game = GameService.findPlayersGame(this.uuid);
		game.playerAskForCard(this.uuid);
		this.finishRound();
	}
	stop(){
		let game = GameService.findPlayersGame(this.uuid);
		game.playerStopped(this.uuid);
		this.finishRound();
	}
	finishRound(){
		let game = GameService.findPlayersGame(this.uuid),
			gameIsEnded = this.gameIsEnded();
		if (!gameIsEnded && this.roundIsFinished()){
			game.dealCards();
			this.broadcastPoints(game);
		}
		else if (gameIsEnded){
			let winners = game.getWinners();
			this.broadcastWinners(winners);
		}
	}
	gameIsEnded(){
		let game = GameService.findPlayersGame(this.uuid);
		return game.gameIsEnded();
	}
	roundIsFinished(){
		let game = GameService.findPlayersGame(this.uuid);
		return game.roundIsFinished();
	}
	broadcastWinners(winners){
		this.broadcast(JSON.stringify({
			method: "gameEnded",
			data: {
				winners: this.getPlayersSendableData(winners)
			}
		}));
	}
}

module.exports = GameController;