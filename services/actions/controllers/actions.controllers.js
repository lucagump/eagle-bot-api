const axios = require('axios')

const config = require('../../../config/config.json');

module.exports = {

    //Simple version, without validation or sanitation
    sendMessage: function(req, res) {
		axios.get(app_domain + '/telegram/test').then(response => {
            console.log("Message posted");
            res.end(response.data);
        }).catch(error =>{
            console.log(error);
        });
    },

    storeTokens: function(req, res) {
        axios.post(app_domain + '/database/token',{
            chatID: req.body.chatID,
            githubToken: req.body.githubToken,
            airtableToken: req.body.githubToken
        }).then(response => {
            console.log("actions/storeToken -> Token Stored");
            res.status(201).send(response.data);
        }).catch(error =>{
            res.status(500).send('500 - Internal Server Error')
            console.log(error);
        });
    },
    
    getTokens: function(req, res) {
        console.log("           " + req.params.chatID)
        axios.get(app_domain + "database/token/" + req.params.chatID)
        .then(response => {
            console.log("actions/getToken -> Token Found");
            res.send(response.data);
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                //console.log(error.response.data);
                //console.log(error.response.status);
                //console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                //console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            //console.log(error.config);
        })
    },
    
    //Simple version, without validation or sanitation
    addTeam: function(req, res) {
        res.send('Add Team');
    }
}