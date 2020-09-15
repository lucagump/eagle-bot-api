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

module.exports = {

    addUser: function(req, res) {
        if (req.body.userID != null && req.body.airtableToken != null && req.body.githubToken != null  && req.body.usernameGitHub != null && req.body.groups != null) {   
            
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
                    console.log(err)
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'User couldn\'t be saved, please try again later'
                        })
                } 
                return res.status(201).send({
                    status: 'success',
                    statusCode: 201,
                    data: user
                })
            })
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                errorMessage: 'Bad Request'
            })
        } 
    },
    getUsers: async function(req, res) {
        User.find({},
            function(err, users) {
                if (err){
                    console.log(err)
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'User couldn\'t not be found'
                      })
                }
                if(users != null){
                    return res.status(200).send({
                        status: 'success',
                        statusCode: 200,
                        data: users
                      })
                } else {
                    return res.status(404).send({
                        status: 'fail',
                        statusCode: 404,
                        errorMessage: 'Users couldn\'t be found, please try again later'
                    })
                }
            }
        )
    },
    getUser: function(req, res) {
        if(req.params.userID != null) {
            User.findOne({ userID: req.params.userID },
                function(err, user) {
                    if (err){
                        console.log(err)
                        return res.status(500).send({
                            status: 'fail',
                            statusCode: 500,
                            errorMessage: 'User couldn\'t not be found'
                        })
                    }
                    if(user != null){
                        return res.status(200).send({
                            status: 'success',
                            statusCode: 200,
                            data: user
                        })
                    } else {
                        return res.status(404).send({
                            status: 'fail',
                            statusCode: 404,
                            errorMessage: 'User couldn\'t be found, please try again later'
                        })
                    }
                }
            ) 
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        } 
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
                    console.log(err)
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'User couldn\'t be update'
                      })
                } 
                if (user != null) {
                    return res.status(201).send({
                        status: 'success',
                        statusCode: 201,
                        data: user
                      })
                } else {
                    return res.status(404).send({
                        status: 'fail',
                        statusCode: 404,
                        errorMessage: 'User couldn\'t be found, please try again later'
                    })
                }
            })
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                errorMessage: 'Bad Request'
            })
        } 
    },
    deleteUser: function(req, res) {
        if (req.params.userID != null) {
            User.findOneAndDelete({ userID: req.params.userID },
                function(err, user) {
                    if (err){
                        console.log(err)
                        return res.status(500).send({
                            status: 'fail',
                            statusCode: 500,
                            errorMessage: 'User couldn\'t be deleted',
                          })
                    }
                    if(user != null){
                        return res.status(200).send({
                            status: 'success',
                            statusCode: 200,
                            data: user
                        })
                    } else {
                        return res.status(404).send({
                            status: 'fail',
                            statusCode: 404,
                            errorMessage: 'User couldn\'t be found, please try again later',
                        })
                    }
                }
            )
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                errorMessage: 'Bad Request',
            })
        } 
    }
}