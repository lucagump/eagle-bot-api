var mongoose = require('mongoose');                     
const config = require('../../../config/config.json');
require('../models/database.models.js');				

const dbuser = process.env.DB_USER || config.mongodb.dbuser;
const dbpassword = process.env.DB_PASSWORD || config.mongodb.dbpassword;
const address = process.env.DB_ADDRESS || config.mongodb.address;
const dbport = process.env.DB_PORT || config.mongodb.port;
const dbname = process.env.DB_NAME || config.mongodb.dbname;

// URL on which the DB is stored
const url = "mongodb://" + dbuser + ":" + dbpassword + "@" + address + ":" + dbport + "/" + dbname;

// MongoDb and Express Config
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

// Set up mongoose connection
mongoose.connect(url,options,
	function (err) {
		if (err)
			console.log("DB error: " + err);
		else
            console.log('\n\n\x1b[33m%s\x1b[0m', url);
	});     

var User = mongoose.model('Users');
var UserToken = mongoose.model('UserToken');

module.exports = {

    //Simple version, without validation or sanitation
    test: function(req, res) {
        res.send('Greetings from the Test method!');
    },

    storeToken: function(req, res) {
        if (req.body.chatID =! null) {
            let usertoken = new UserToken({
                userID: req.body.userID,
                chatID: req.body.chatID,
                usernameTelegram: req.body.username,
                githubToken: req.body.githubToken,
                airtableToken: req.body.airtableToken,
            });
            usertoken.save(function(err) {
                if (err) {
                    console.log('\x1b[33mThere was an error while saving the usertoken\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                } 
                res.status(201).send(usertoken)
            })
        } else {
            res.status(400).send('400 - Bad Request')
        } 
    },

    getToken: function(req, res) {
        UserToken.findOne({ chatID: req.params.chatID },
            function(err, usertoken) {
                if (err){
                    console.log('\x1b[33mThere was an error while looking up the usertoken\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                }
                if(usertoken != null){
                    res.status(200).json(usertoken)
                } else {
                    console.log('\x1b[33mUser Token of ' + req.params.id + ' Not Found\x1b[0m\n')
                    res.status(404).send('404 - ChatID Not Found')
                }
            }
        )
    },

    updateToken: function(req, res) {
        if (req.body.chatID =! null) {
            let usertoken = new UserToken({
                chatID: req.body.chatID
            });
            if (req.body.githubToken =! null) {
                usertoken = {
                    githubToken: req.body.githubToken
                } 
            }
            if (req.body.airtableToken =! null) {
                usertoken = {
                    airtableToken: req.body.airtableToken,
                } 
            }
            UserToken.findOneAndUpdate({ chatID: req.params.chatID }, usertoken, {new: true}, function(err, userTokenUpdated) {
                if (err) {
                    console.log('\x1b[33mThere was an error while updating the usertoken\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                } 
                if (userTokenUpdated != null) {
                    res.status(201).send(userTokenUpdated)
                } else {
                    console.log('\x1b[33mUser Token of ' + req.body.chatID + ' Not Found\x1b[0m\n')
                    res.status(404).send('404 - UserToken Not Found')
                }
            })
        } else {
            res.status(400).send('400 - Bad Request')
        } 
    },
    // Check se esiste poi check se posso eliminare roasted bitch
    deleteTokeNN: function(req,res) {
        UserToken.findOne({ chatID: req.params.chatID }, (error, UserToken) => {
            if (error) res.status(500).send('500 - Internal Server Error');
            if (!UserToken) res.status(404).send('404 - UserToken Not Found');
            UserToken.remove({ chatID: req.params.chatID }, error => {
              if (error) res.status(500).send('500 - Internal Server Error');
              res.status(201).send(UserToken)
            });
        });
    },
    
    deleteToken: function(req, res) {
        UserToken.findOneAndDelete({ chatID: req.params.chatID },
            function(err, usertoken) {
                if (err){
                    console.log('\x1b[33mThere was an error while looking up the usertoken\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                }
                if(usertoken != null){
                    res.status(200).json(usertoken)
                } else {
                    console.log('\x1b[33mUser Token of ' + req.params.id + ' Not Found\x1b[0m\n')
                    res.status(404).send('404 - ChatID Not Found')
                }
            }
        )
    },
}