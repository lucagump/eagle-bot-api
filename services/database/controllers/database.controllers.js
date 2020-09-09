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

function save(document){
    document.save(function(err,document) {
        if (err) {
            console.log(err)
            console.log('\x1b[33mThere was an error while saving up the '+ document + '\x1b[0m\n')
            return [500,{}]
        } 
        return [201,document]
    })
}
function getOne(document,filter){
    document.findOne({ filter },
        function(err, doc) {
            if (err){
                console.log('\x1b[33mThere was an error while looking up the '+ document + '\x1b[0m\n')
                return [500,{}]
            }
            if(doc != null){
                return [200,doc]
            } else {
                console.log('\x1b[33m'+ document + filter + ' Not Found\x1b[0m\n')
                return [404,{}]
            }
        }
    )
}
function getMany(document){
    document.find({},
        function(err, docs) {
            if (err){
                console.log('\x1b[33mThere was an error while looking up the '+ document + '\x1b[0m\n')
                return [500,{}]
            }
            if(docs != null){
                return [200,docs]
            } else {
                console.log('\x1b[33m'+ document + filter + ' Not Found\x1b[0m\n')
                return [404,{}]
            }
        }
    )
}
function deleteOne(document,filter){
    document.findOneAndDelete(filter,
        function(err, doc) {
            if (err){
                console.log('\x1b[33mThere was an error while looking up the '+ document + '\x1b[0m\n')
                return [500,{}]
            }
            if(doc != null){
                return [200,docs]
            } else {
                console.log('\x1b[33m'+ document + filter + ' Not Found\x1b[0m\n')
                return [404,{}]
            }
        }
    )
}
function updateOne(document,filter, updateDoc){
    document.findOneAndUpdate(filter, updateDoc, {new: true}, function(err, doc) {
        if (err){
            console.log('\x1b[33mThere was an error while looking up the '+ document + '\x1b[0m\n')
            return [500,{}]
        }
        if(doc != null){
            return [201,updateDoc] // doc or updatedoc?
        } else {
            console.log('\x1b[33m'+ document + filter + ' Not Found\x1b[0m\n')
            return [404,{}]
        }
    })
}

module.exports = {

    addUser: function(req, res) {
        if (req.body.userID != null && req.body.airtableToken != null && req.body.githubToken != null  && req.body.usernameGitHub != null && req.body.groups != null) {   
            User.findOne({ userID: req.body.userID },
                function(err, doc) {
                    if (err){
                        console.log('\x1b[33mThere was an error while looking up the '+ document + '\x1b[0m\n')
                        return res.status(500).send('500 - Internal Server Error');
                    }
                    if(doc != null){
                        return res.status(202).send("202 - User is already in database")
                    } else {
                        let user = new User({
                            userID: req.body.userID,
                            chatID: req.body.chatID,
                            usernameTelegram: req.body.usernameTelegram,
                            usernameGitHub: req.body.usernameGitHub,
                            groups: req.body.groups,
                            githubToken: req.body.githubToken,
                            airtableToken: req.body.airtableToken,
                            airtableBase: req.body.airtableBase
                        });
            
                        user.save(function(err,doc) {
                            if (err) {
                                console.log('\x1b[33mThere was an error while saving the usertoken\x1b[0m\n')
                                return res.status(500).send('500 - Internal Server Error');
                            } 
                            return res.status(201).send(doc)
                        })
                    }
                }
            )
        } else {
            return res.status(400).send('400 - Bad Request')
        } 
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
        User.findOne({ userID: req.params.userID },
            function(err, user) {
                if (err){
                    console.log('\x1b[33mThere was an error while looking up the user\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                }
                if(user != null){
                    res.status(200).json(user)
                } else {
                    console.log('\x1b[33mUser ' + req.params.userID + ' Not Found\x1b[0m\n')
                    res.status(404).send('404 - User Not Found')
                }
            }
        ) 
    },
    updateUser: function(req, res) {
        if (req.params.userID != null && (req.body.githubToken != null || req.body.airtableToken != null)) {
            if (req.body.githubToken != null) {
                userInfo = {
                    githubToken: req.body.githubToken
                } 
            }
            if (req.body.airtableToken != null) {
                userInfo = {
                    airtableToken: req.body.airtableToken,
                } 
            }
            User.findOneAndUpdate({ userID: req.params.userID }, userInfo, {new: true}, function(err, user) {
                if (err) {
                    console.log('\x1b[33mThere was an error while updating the usertoken\x1b[0m\n')
                    res.status(500).send('500 - Internal Server Error');
                } 
                if (user != null) {
                    res.status(201).send(user)
                } else {
                    console.log('\x1b[33mUser of ' + req.body.userID + ' Not Found\x1b[0m\n')
                    res.status(404).send('404 - UserToken Not Found')
                }
            })
        } else {
            res.status(400).send('400 - Bad Request')
        } 
    },
    deleteUser: function(req, res) {
        if (req.params.userID != null) {
            User.findOneAndDelete({ userID: req.params.userID },
                function(err, user) {
                    if (err){
                        console.log('\x1b[33mThere was an error while looking up the user\x1b[0m\n')
                        res.status(500).send("500 - Internal Server Error");
                    }
                    if(user != null){
                        res.status(200).send(user)
                    } else {
                        console.log('\x1b[33mUser ' + req.params.userID + ' Not Found\x1b[0m\n')
                        res.status(404).send("404 - User Not Found")
                    }
                }
            )
        } else {
            return res.status(400).send('400 - Bad Request')
        } 
    }
}