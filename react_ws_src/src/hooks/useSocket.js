import io from 'socket.io-client'


const useSocket = (url, onConnect, onPaired, onOppTurn, onRestart, onEndGame) => {
  const socket = io(url);

  socket.on('connect', () => onConnect(socket));
  socket.on('pair_players', onPaired);
  socket.on('opp_turn', onOppTurn);
  socket.on('restart', onRestart);
  socket.on('endGame', onEndGame);

  return socket;
}

export default useSocket;