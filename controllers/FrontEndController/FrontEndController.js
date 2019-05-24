let { BaseController } = require("web-wombat");

class FrontEndController extends BaseController{
	serve(){
		let route = this.request.routeVariables.route,
			{ readFileSync } = require("fs"),
			{ resolve } = require("path");
		if (route.length > 0){
			this.response.end(readFileSync(resolve(require.main.filename, "../client/dist/", route)));
		}
		else{
			this.response.end(readFileSync(resolve(require.main.filename, "../client/dist/index.html")));
		}
	}
}

module.exports = FrontEndController;