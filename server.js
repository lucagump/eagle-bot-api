var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan'); // log requests to the console (express4)
var path = require('path');

var dotenv = require('dotenv');
var result = dotenv.config();
console.log(result.parsed);

// Choose what port to use. If deployed on heroku process.env.PORT will be set and therefore used
const expressport = process.env.PORT;

if(process.env.NODE_ENV == 'dev') {
  global.app_domain = "http://localhost:" + expressport; 
}
if(process.env.NODE_ENV == 'production') {
  global.app_domain = "https://eagle-bot-api.herokuapp.com"; 
}

// Create the app
var app = express();
//app.use(session({ secret: 'shshshshsh', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));        // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));             // parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());                                     // parse application/json

app.use(cors());
             
// Include Business routes
var business_routes = require('./services/business/actions/business.routes.js');
app.use('/business', business_routes);

// Include Business routes
var process_routes = require('./services/process/actions/process.routes.js');
app.use('/process', process_routes);

// Include Data DataBase routes
var db_routes = require('./services/data/database/database.routes.js');
app.use('/database', db_routes);

// Include Adapter Airtable routes
var airtable_routes = require('./services/adapter/airtable/airtable.routes.js');
app.use('/airtable', airtable_routes);

// Include Adapter Github routes
var github_routes = require('./services/adapter/github/github.routes.js');
app.use('/github', github_routes);

// Include Telegram routes
var telegram_routes = require('./services/interface/telegram/telegram.routes.js');
app.use('/telegram', telegram_routes);

// Start interface Telegram Service 
var telegram_interface = require('./services/interface/telegram/telegram.interface.js');

// Just an Index 
app.get('/', function(req, res) {
    res.sendFile(path.join('.public/index.html'));
});

app.listen(expressport, () => {
    console.log('\x1b[5m%s\x1b[0m', 'Server is up and running on ' + global.app_domain + '\n');
});