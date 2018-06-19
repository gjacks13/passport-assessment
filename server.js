const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketEvents = require('./config/socketEvents');
const apiRoutes = require('./routes/index');
const http = require('http');

// load envrionment and config
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js');

// load config variables
const { MONGO_URI, PORT } = config[env];

const app = express();
const server = http.Server(app);

// connect to mongo database
mongoose.connect(MONGO_URI)
  .catch(err => console.log(err));

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// server up client build folder
app.use(express.static('client/build'));

// load routes
app.use(apiRoutes);

// start server
server.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});

// start listening for socket.io events
const io = require('socket.io').listen(server);

socketEvents(io);

/*
 * I'm attaching the io instance to the app instance.
 * This will allow easy access in our routing logic.
 * There may be a better way to integrate express and
 * socket.io. This is my first time integrating the two.
 * I'll explore better integration options in the near future.
 * */
app.io = io;
