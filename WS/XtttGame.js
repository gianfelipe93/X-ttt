const { Player } = require("./Player");

class Game {
	constructor(io) {
		this.player = null
		this.players = [];
		this.players_avail = [];
		this.socket = null;
		this.io = io;

		this.onNewPlayer = this.onNewPlayer.bind(this);
		this.onTurn = this.onTurn.bind(this);
		this.onClientDisconnect = this.onClientDisconnect.bind(this);
	}

	_addPlayerToGame(name) {
		var newPlayer = new Player(name, this.socket);
		this.players.push(newPlayer);
		this.players_avail.push(newPlayer);
		this.player = newPlayer;

		this.pair_avail_players()
	}

	onNewPlayer(data) {
		util.log("New player has joined: " + data.name);

		this._addPlayerToGame(data.name);
	}

	_onBoardUser(p1, p2) {
		p1.mode = 'm';
		p2.mode = 's';
		p1.status = 'paired';
		p2.status = 'paired';
		p1.opp = p2;
		p2.opp = p1;
	}

	pair_avail_players() {
		if (this.players_avail.length < 2)
			return;

		var p1 = this.players_avail.shift();
		var p2 = this.players_avail.shift();

		this._onBoardUser(p1, p2);

		p1.socket.emit("pair_players", { uid: p1.uid, opp: { name: p2.name, uid: p2.uid }, mode: 'm' });
		p2.socket.emit("pair_players", { uid: p2.uid, opp: { name: p1.name, uid: p1.uid }, mode: 's' });

		util.log("connect_new_players - uidM:" + p1.uid + " (" + p1.name + ")  ++  uidS: " + p2.uid + " (" + p2.name + ")");
	}

	onTurn(data) {
		const opp = this.players.find(p => p.uid !== data.currentUid)
		opp.socket.emit("opp_turn", { cell_id: data.cell_id });
	};

	onClientDisconnect() {
		var removePlayer = this.player.uid;
		this.players.splice(this.players.indexOf(removePlayer), 1);
		this.players_avail.splice(this.players_avail.indexOf(removePlayer), 1);

		if (this.status == "admin") {
			util.log("Admin has disconnected: " + this.uid);
		} else {
			util.log("Player has disconnected: " + this.id);
		}
	}

	onRestart(data) {
		console.log({ data, players: this.players })
		const opp = this.players.find(p => p.uid !== data.currentUid)
		opp.socket.emit("restart", {});
	}

	listen(socket) {
		this.socket = socket;

		socket.on("new player", (data) => this.onNewPlayer(data));
		socket.on("ply_turn", (data) => this.onTurn(data));
		socket.on("restart", (data) => this.onRestart(data));
		socket.on("disconnect", () => this.onClientDisconnect());

	}
}

exports.Game = Game;