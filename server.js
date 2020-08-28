var express = require('express');
var app = express();
var session = require('express-session');

var bodyParser = require('body-parser');
var morgan = require('morgan');                         // log requests to the console (express4)
var config = require('./config/config.json');
var path = require('path');

// Choose what port to use. If deployed on heroku process.env.PORT will be set and therefore used
const expressport = process.env.PORT || config.express.port;
global.app_domain = "http://localhost:" + expressport; 
// global.app_domain = "https://eagle-cms.herokuapp.com" + expressport ;

app.use(session({ secret: 'ssshhhhh', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));        // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));             // parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());                                     // parse application/json

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

// Include DataBase routes
var db_routes = require('./services/database/database.routes.js');
app.use('/database', db_routes);

// Include Actions routes
var actions_routes = require('./services/actions/actions.routes.js');
app.use('/actions', actions_routes);

// Include Airtable routes
var airtable_routes = require('./services/airtable/airtable.routes.js');
app.use('/airtable', airtable_routes);

// Include Github routes
var github_routes = require('./services/github/github.routes.js');
app.use('/github', github_routes);

// Start Telegram Service with relative routes
var telegram_interface = require('./services/interface/telegram.interface.js');
app.use('/telegram', telegram_interface);

// Just an Index 
app.get('/', function(req, res) {
    res.sendFile(path.join('.public/index.html'));
});

app.listen(expressport, () => {
    console.log('\x1b[5m%s\x1b[0m', 'Server is up and running on port number ' + expressport + '\n');
});