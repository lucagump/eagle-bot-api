const axios = require('axios')

const config = require('../../../config/config.json');
require('../models/github.models.js');						

const uri = config.github.uri;

module.exports = {

    //Simple version, without validation or sanitation
    test: function(req, res) {
        res.send('Greetings from the Test method!');
    },

    getIssues: function(req, res) {        
        // URL used to retrieve data dinamically
        let url = uri + "orgs/eagletrt/issues";
        const response = axios.get(url, { 
            headers: {
                'Authorization': config.github.token
            }
        })
        .then(function (response) {
            console.log(response.data);
            res.status(201).send(response.data);
        })
        .catch(function (error) {
        console.log(error);
        })
        .then(function () {
            console.log("Every time you hit me")
        })
    },

    getRepositories: function(req, res) {
    
    },
}