// Setup basic express server
var express = require('express');
const { Game } = require('./XtttGame.js');
var app = express();
var server = require('http').createServer(app);
const io = require('socket.io')(server);

util = require("util");							// Utility resources (logging, object inspection, etc)
const game = new Game(io);

var port = process.env.PORT || 3001;

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));
io.on('connection', (socket) => game.listen(socket));