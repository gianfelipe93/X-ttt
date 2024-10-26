const { STATUSES } = require("./util/constants");

/**************************************************
** GAME PLAYER CLASS
**************************************************/
class Player {
	constructor(name, socket) {
		this.uid = _generateUID();
		this.status = STATUSES.LOOKING;
		this.sockid = socket.id;
		this.socket = socket;
		this.mode = null;
		this.name = name;
		this.opp = null;
	}

	get status() {
		return this.status;
	}

	set status(s) {
		if (s === STATUSES.LOOKING || s === STATUSES.PAIRED)
			this.status = s;
		else
			throw new Error("Invalid status");
	}

	_generateUID = () => {
		return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(16).toString().replace(".", ""));
	}
}

exports.Player = Player;