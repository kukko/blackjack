let { Route, MiddlewareProvider } = require("web-wombat");

module.exports = [
	Route.get("/", require("../controllers/FrontEndController/FrontEndController")),
	Route.websocket("/game", require("../controllers/GameController/GameController"))
];
