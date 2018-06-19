/*
 * Not much here. We don't really listen for events from the client.
 * We only emit events to the client when we receive a call to a
 * mutating route.
 * */
module.exports = (io) => {
  // set socket.io listeners.
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
