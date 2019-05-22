let { WombatServer } = require("web-wombat");

WombatServer.withoutDatabase().setUnsecure().init();