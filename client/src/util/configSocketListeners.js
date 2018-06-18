import toastr from 'toastr';

export default (socket, reactApp) => {
  socket.on('add factory', () => {
    reactApp.loadState();
    toastr.info('A new Factory has been added to the tree.');
  });

  socket.on('update factory', () => {
    reactApp.loadState();
    toastr.info('A Factory in the tree has been updated.');
  });

  socket.on('delete factory', () => {
    reactApp.loadState();
    toastr.info('A Factory in the tree has been deleted.');
  });

  socket.on('add node', () => {
    reactApp.loadState();
    toastr.info('All nodes for a factory have been generated.');
  });

  socket.on('delete node', () => {
    reactApp.loadState();
    toastr.info('All nodes for a factory have been deleted.');
  });
};
