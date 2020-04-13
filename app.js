const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes.js');
const app = express();

const config = require('./config/config.json');

// MongoDb and Express Config
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};
const dbuser = config.mongodb.dbuser;
const dbpassword = config.mongodb.dbpassword;
const address = config.mongodb.address;
const dbport = config.mongodb.port;
const expressport = config.express.port;
const dbname = config.mongodb.dbname;

// Set up mongoose connection
const url = "mongodb://" + dbuser + ":" + dbpassword + "@" + address + ":" + dbport + "/" + dbname;

mongoose.connect(url, options);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
console.log('\n\n\x1b[33m%s\x1b[0m', url);


// Set up Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);

app.listen(expressport, () => {
    console.log('\x1b[5m%s\x1b[0m', 'Server is up and running on port number ' + expressport + '\n');
});