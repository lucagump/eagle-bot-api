const axios = require('axios')

const config = require('../../../config/config.json');

function handleError(error){
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
}

async function sendMessage(req){
    try {
        const response = await axios.get(app_domain + '/telegram/test')
        return response.data
    } catch (error) {
        handleError(error)
    }  
}

async function storeUserToken(req){
    try {
      const response = await axios.post(app_domain + '/database/token',{
        userID: req.body.userID,
        chatID: req.body.chatID,
        username: req.body.username,
        githubToken: req.body.githubToken,
        airtableToken: req.body.githubToken
      });
      return response.data
    } catch (error) {
        handleError(error)
    }
}
async function getUserToken(req){
    try {
        const response = await axios.get(app_domain + "/database/token/" + req.params.chatID)
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
async function deleteUserToken(req){
    console.log("actions/getToken -> Token Found");

    try {
        const response = await axios.delete(app_domain + "/database/token/" + req.params.chatID)
        console.log("actions/getToken -> Token Found");
        return response.data

    } catch (error) {
        console.log(error)
    }  
}
            

module.exports = {

    sendMessage: async function(req, res) {
        try {
            const message = await this.sendMessage(req)
            await res.status(200).send(message);
        } catch (error) {
            res.status(500).send('500 - Internal Server Error')
            console.log(error);
        }
    },

    storeTokens: async function(req, res) {
        try {
            const message = await storeUserToken(req)
            await res.status(200).send(message);
        } catch (error) {
            res.status(500).send('500 - Internal Server Error')
            console.log(error);
        }
    },
    
    getTokens: async function(req, res) {
        try {
            const message = await getUserToken(req)
            res.status(200).send(message);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },

    deleteTokens: async function(req, res) {
        try {
            const message = await deleteUserToken(req)
            res.status(200).send(message);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    
    //    storeTokens: function(req, res) {
    //        axios.post(app_domain + '/database/token',{
    //            chatID: req.body.chatID,
    //            githubToken: req.body.githubToken,
    //            airtableToken: req.body.githubToken
    //        }).then(response => {
    //            console.log("actions/storeToken -> Token Stored");
    //            res.status(201).send(response.data);
    //        }).catch(error =>{
    //            res.status(500).send('500 - Internal Server Error')
    //            console.log(error);
    //        });
    //    },

    //    getTokens: function(req, res) {
    //        console.log("           " + req.params.chatID)
    //        axios.get(app_domain + "database/token/" + req.params.chatID)
    //        .then(response => {
    //            console.log("actions/getToken -> Token Found");
    //            res.send(response.data);
    //        })
    //        .catch(function (error) {
    //            if (error.response) {
    //                // The request was made and the server responded with a status code
    //                // that falls out of the range of 2xx
    //                //console.log(error.response.data);
    //                //console.log(error.response.status);
    //                //console.log(error.response.headers);
    //            } else if (error.request) {
    //                // The request was made but no response was received
    //                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //                // http.ClientRequest in node.js
    //                //console.log(error.request);
    //            } else {
    //                // Something happened in setting up the request that triggered an Error
    //                console.log('Error', error.message);
    //            }
    //            //console.log(error.config);
    //        })
    //    },
    
}