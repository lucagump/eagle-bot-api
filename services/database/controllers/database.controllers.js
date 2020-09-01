var mongoose = require('mongoose');                     
require('../models/database.models.js');				

const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASSWORD;
const address = process.env.DB_ADDRESS;
const dbport = process.env.DB_PORT;
const dbname = process.env.DB_NAME;

// Documentation
// https://mongoosejs.com/

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
var Group = mongoose.model('Groups');

module.exports = {

    //Simple version, without validation or sanitation
    test: function(req, res) {
        res.send('Greetings from the Test method!');
    },

    addUser: function(req, res) {
        if (req.body.chatID != null) {
            let user = new User({
                userID: req.body.userID,
                chatID: req.body.chatID,
                usernameTelegram: req.body.usernameTelegram,
                usernameGitHub: req.body.usernameGitHub,
                group: req.body.group,
                githubToken: req.body.githubToken,
                airtableToken: req.body.airtableToken,
                airtableBase: req.body.airtableBase
            });
            user.save(function(err,user) {
                if (err) {
                    console.log(err)
                    console.log('\x1b[33mThere was an error while saving the usertoken\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                } 
                res.status(201).send(user)
            })
        } else {
            res.status(400).send('400 - Bad Request')
        } 
    },

    addGroup: function(req, res) {
        if (req.body.group =! null) {
            let group = new Group({
                group: req.body.group,
                repositories: req.body.repositories
            });
            group.save(function(err) {
                if (err) {
                    console.log('\x1b[33mThere was an error while saving the group\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                } 
                res.status(201).send(group)
            })
        } else {
            res.status(400).send('400 - Bad Request')
        } 
    },

    getGroups: async function(req, res) {
        Group.find({},
            function(err, groups) {
                if (err){
                    console.log('\x1b[33mThere was an error while looking up the groups\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                }
                if(groups != null){
                    res.status(200).json(groups)
                } else {
                    res.status(404).send('404 - groups Not Found')
                }
            }
        )
    },

    deleteGroup: function(req, res) {
        Group.findOneAndDelete({ group: req.params.group },
            function(err, group) {
                if (err){
                    console.log('\x1b[33mThere was an error while looking up the group\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                }
                if(group != null){
                    res.status(200).json(group)
                } else {
                    console.log('\x1b[33mGroup ' + req.params.group + ' Not Found\x1b[0m\n')
                    res.status(404).send('404 - group Not Found')
                }
            }
        )
    },

    getGroup: function(req, res) {
        Groups.findOne({ group: req.params.group },
            function(err, group) {
                if (err){
                    console.log('\x1b[33mThere was an error while looking up the user\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                }
                if(group != null){
                    res.status(200).json(group)
                } else {
                    console.log('\x1b[Group ' + req.params.group + ' Not Found\x1b[0m\n')
                    res.status(404).send('404 - Group Not Found')
                }
            }
        )
    },

    getUsers: async function(req, res) {
        User.find({},
            function(err, users) {
                if (err){
                    console.log('\x1b[33mThere was an error while looking up the user\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                }
                if(users != null){
                    res.status(200).json(users)
                } else {
                    res.status(404).send('404 - Users Not Found')
                }
            }
        )
    },

    getUser: function(req, res) {
        User.findOne({ chatID: req.params.chatID },
            function(err, user) {
                if (err){
                    console.log('\x1b[33mThere was an error while looking up the user\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                }
                if(user != null){
                    res.status(200).json(user)
                } else {
                    console.log('\x1b[33mUser ' + req.params.chatID + ' Not Found\x1b[0m\n')
                    res.status(404).send('404 - User Not Found')
                }
            }
        )
    },

    updateUser: function(req, res) {
        if (req.body.chatID =! null) {
            if (req.body.githubToken =! null) {
                user = {
                    githubToken: req.body.githubToken
                } 
            }
            if (req.body.airtableToken =! null) {
                user = {
                    airtableToken: req.body.airtableToken,
                } 
            }
            User.findOneAndUpdate({ chatID: req.params.chatID }, user, {new: true}, function(err, user) {
                if (err) {
                    console.log('\x1b[33mThere was an error while updating the usertoken\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                } 
                if (user != null) {
                    res.status(201).send(user)
                } else {
                    console.log('\x1b[33mUser of ' + req.body.chatID + ' Not Found\x1b[0m\n')
                    res.status(404).send('404 - UserToken Not Found')
                }
            })
        } else {
            res.status(400).send('400 - Bad Request')
        } 
    },
    // Check se esiste poi check se posso eliminare roasted bitch
    deleteUserr: function(req,res) {
        User.findOne({ chatID: req.params.chatID }, (error, user) => {
            if (error) res.status(500).send('500 - Internal Server Error');
            if (!user) res.status(404).send('404 - user Not Found');
            User.remove({ chatID: req.params.chatID }, error => {
              if (error) res.status(500).send('500 - Internal Server Error');
              res.status(201).send(user)
            });
        });
    },
    
    deleteUser: function(req, res) {
        User.findOneAndDelete({ chatID: req.params.chatID },
            function(err, user) {
                if (err){
                    console.log('\x1b[33mThere was an error while looking up the user\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                }
                if(user != null){
                    res.status(200).json(user)
                } else {
                    console.log('\x1b[33mUser ' + req.params.chatID + ' Not Found\x1b[0m\n')
                    res.status(404).send('404 - user Not Found')
                }
            }
        )
    },
}