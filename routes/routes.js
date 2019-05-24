let { Route, MiddlewareProvider } = require("web-wombat");

module.exports = [
	Route.get("/{route}", require("../controllers/FrontEndController/FrontEndController")),
	Route.websocket("/game", require("../controllers/GameController/GameController"))
];
