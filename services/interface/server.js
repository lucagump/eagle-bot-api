var express = require('express');
var app = express();
var cors = require('cors')
var util = require('util');
var fs = require('fs');

var dotenv = require('dotenv');
const result = dotenv.config()
 
if (result.error) {
  throw result.error
}
console.log(result.parsed)

var bodyParser = require('body-parser');
var morgan = require('morgan'); // log requests to the console (express4)
var path = require('path');

const expressport = process.env.PORT;

global.app_domain = "http://localhost:" + expressport; 
//global.app_domain = "https://eagle-cms.herokuapp.com";

//app.use(session({ secret: 'shshshshsh', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));        // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));             // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json

app.use(cors());
            
// const promisedWriteFile = util.promisify(fs.writeFile);
            

// Include Telegram routes
var telegram_routes = require('./services/interface/telegram.routes.js');
app.use('/telegram', telegram_routes);

// Start Telegram Service 
var telegram_interface = require('./services/interface/telegram.interface.js');

