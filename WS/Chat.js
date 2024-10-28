class Chat {
  constructor(io) {
    this.chats = [];
    this.socket = null;
    this.io = io;

    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage(data) {
    this.io.emit("newMessage", data);
  }

  listen(socket) {
    this.socket = socket;

    socket.on("newMessage", (data) => this.sendMessage(data));
  }
}

exports.Chat = Chat;