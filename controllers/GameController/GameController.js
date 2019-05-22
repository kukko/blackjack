let { WebSocketController } = require("web-wombat"),
	GameService = require("../../classes/services/GameService.js");

class GameController extends WebSocketController{
	onMessage(message){
		message = JSON.parse(message);
		this[message.method](message.data);
	}
	login(data){
		let game = GameService.joinGame(this.uuid, data.name),
			players = [];
		this.notifyOtherPlayers(game);
		for (let playerIndex in game.players){
			let player = game.players[playerIndex];
			players.push({
				name: player.name,
				point: player.valueOfHand()
			});
		}
		this.send(JSON.stringify({
			method: "joinGame",
			data: {
				gameName: game.name,
				players
			}
		}));
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
}

module.exports = GameController;