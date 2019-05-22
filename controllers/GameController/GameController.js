let { WebSocketController } = require("web-wombat"),
	GameService = require("../../classes/services/GameService.js");

class GameController extends WebSocketController{
	onMessage(message){
		message = JSON.parse(message);
		this[message.method](message.data);
	}
	login(data){
		GameService.joinGame(this.uuid, data.name);
	}
}

module.exports = GameController;