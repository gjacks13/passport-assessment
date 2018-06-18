const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/index');

// load envrionment and config
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js');

// load config variables
const { MONGO_URI, PORT } = config[env];

const app = express();

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
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
