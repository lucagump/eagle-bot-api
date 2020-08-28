var mongoose = require('mongoose');                     // mongoose for mongodb
const config = require('../../../config/config.json');
require('../models/database.models.js');						// create the models for the objs

const dbuser = config.mongodb.dbuser;
const dbpassword = config.mongodb.dbpassword;
const address = config.mongodb.address;
const dbport = config.mongodb.port;
const dbname = config.mongodb.dbname;

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
            console.log("Connected to db");
            console.log('\n\n\x1b[33m%s\x1b[0m', url);
	});     // connect to mongoDB database

//const db = mongoose.connection;

var Product = mongoose.model('Products');
var User = mongoose.model('Users');
var UserToken = mongoose.model('UserToken');

function generateRandomInt(min, max) {
    let value = parseInt(Math.random() * (max - min) + min);
    return value;
}

module.exports = {

    //Simple version, without validation or sanitation
    test: function(req, res) {
        res.send('Greetings from the Test method!');
    },

    storeToken: function(req, res) {
        let usertoken = new UserToken({
            chatID: req.body.chatID,
            githubToken: req.body.githubToken,
            airtableToken: req.body.airtableToken,
        });

        usertoken.save(function(err) {
            if (err) {
                console.log(err)
                res.status(500).send('Product couldn\'t be saved :(');
            } 
            res.status(201).send(usertoken)
        })
    },

    getToken: function(req, res) {
        console.log(req.params.chatID)
        UserToken.findOne({ chatID: req.params.chatID },
            function(err, usertoken) {
                if (err){
                console.log(err)
                res.status(500).send('Request couldn\'t be processed :(');
                }
                if(usertoken != null)
                res.status(200).json(usertoken)
            }
        )
    },

    createProduct: function(req, res) {
        let product = new Product({
            name:"Banana",
            price: 10 + generateRandomInt(-2, 2),
        });

        product.save(function(err) {
            if (err) {
                console.log(err)
                res.status(500).send('Product couldn\'t be saved :(');
            }
            res.status(201).send(product)
        })
    },

    getProduct: function(req, res) {
        Product.findById(req.params.id, function(err, product) {
            if (err){
            console.log(err)
            res.status(500).send('Request couldn\'t be processed :(');
            }

            if(product != null)
            res.status(200).send(product)
            else
            res.status(404).send('Product couldn\'t be found :(');

        })
    }
}