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
				players: this.getPlayersSendableData(game)
			}
		}));
	}
	getPlayersSendableData(game){
		let output = [];
		for (let playerIndex in game.players){
			let player = game.players[playerIndex];
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
		if (typeof game.nextStep === "undefined"){
			game.nextStep = setTimeout(() => {
				game.dealCard();
				this.broadcastPoints(game);
			}, game.openTime * 1000);
		}
	}
	broadcastPoints(game){
		for (let playerIndex in game.players){
			let player = game.players[playerIndex];
			if (!player.isAI){
				this.sendTo(player.connectionId, JSON.stringify({
					method: "cardDrawed",
					data: {
						players: this.getPlayersSendableData(game)
					}
				}));
			}
		}
	}
}

module.exports = GameController;