/**************************************************
** GAME PLAYER CLASS
**************************************************/
class Player {
	constructor(name, socket) {
		this.uid = _generateUID();
		this.status = 'looking';
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
		if (s === 'looking' || s === 'paired' || s === 'playing')
			this.status = s;
		else
			throw new Error("Invalid status");
	}

	_generateUID = () => {
		return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(16).toString().replace(".", ""));
	}
}

exports.Player = Player;