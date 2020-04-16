var express = require('express');
var app = express();
var session = require('express-session');

var bodyParser = require('body-parser');
var morgan = require('morgan');                         // log requests to the console (express4)
var config = require('./config/config.json');
var path = require('path');

global.app_domain = "http://localhost:8080" //https://safexchange.herokuapp.com"

app.use(session({ secret: 'ssshhhhh', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));        // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));             // parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());                                     // parse application/json

// Choose what port to use. If deployed on heroku process.env.PORT will be set and therefore used
const expressport = process.env.PORT || config.express.port;

/** middleware route to support CORS and preflighted requests */
app.use(function (req, res, next) {
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Credentials", false);
        res.header("Access-Control-Max-Age", '86400'); // 24 hours
        res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    }
    else {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }

    next();
});

// Include DATABASE routes
var db_routes = require('./services/database/database.routes.js');
app.use('/database', db_routes);





app.listen(expressport, () => {
    console.log('\x1b[5m%s\x1b[0m', 'Server is up and running on port number ' + expressport + '\n');
});