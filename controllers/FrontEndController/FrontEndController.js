let { BaseController } = require("web-wombat");

class FrontEndController extends BaseController{
	serve(){
		this.view("index");
	}
}

module.exports = FrontEndController;