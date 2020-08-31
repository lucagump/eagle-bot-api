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

async function repositories(token){
    try {
        const response = await axios.get(app_domain + "/github/repositories/" + token)
        console.log(response.data)
        return response.data
    } catch (error) {
        handleError(error)
    }  
}

async function issues(token){
    try {
        const response = await axios.get(app_domain + "/github/issues/" + token)
        console.log(response.data)
        return response.data
    } catch (error) {
        handleError(error)
    }  
}

async function newGitHubIssue(req,githubToken,repository){
    try {
        const response = await axios.post(app_domain + "/github/issues/",{
            title: req.body.title,
            title: req.body.description,
            repository: req.body.repository,
            githubToken: req.body.githubToken
        })
        console.log(response.data)
        return response.data
    } catch (error) {
        handleError(error)
    }  
}

async function newAirTableIssue(req,airtableToken,airtableBase){
    try {
        const response = await axios.post(app_domain + "/airtable/task/",{
            title: req.body.title,
            title: req.body.description,
            group: req.body.group,
            airtableToken: airtableToken,  
            airTableBase: airtableBase
        })
        console.log(response.data)
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
           

async function storeUserToken(req){
    try {
        console.log("actions/storeUserToken -> Token Found");
        const response = await axios.post(app_domain + '/database/user',{
            userID: req.body.userID,
            chatID: req.body.chatID,
            usernameTelegram: req.body.usernameTelegram,
            usernameGitHub: req.body.usernameGithub,
            group: req.body.group,
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
        console.log("actions/getUserToken -> Token Found");
        const response = await axios.get(app_domain + "/database/user/" + req.params.chatID)
        return await response.data
    } catch (error) {
        handleError(error)
    }  
}
async function deleteUserToken(req){
    try {
        const response = await axios.delete(app_domain + "/database/user/" + req.params.chatID)
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

    getRepositories: async function(req, res) {
        try {
            const user = await getUserToken(req)
            const repos = await repositories(user.githubToken)
            await res.status(200).send(repos);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },

    createIssue: async function(req, res) {
        try {
            const user = await getUserToken(req)
            const task = await newGitHubIssue(req,user.githubToken)
            const issue = await newAirTableIssue(req,user.airtableToken,user.airtableBase)
            await res.status(200).send("ISSUE to check?");
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },

    getIssues: async function(req, res) {
        try {
            const user = await getUserToken(req)
            const repos = await issues(user.githubToken)
            await res.status(200).send(repos);
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
    
    postman: async function(req, res) {

        var data = JSON.stringify({"title":"Found another bug","body":"I'm having health disease caused by github api.","labels":["bug"]});
        var config = {
            method: 'post',
            url: 'https://api.github.com/repos/eagletrt/telemetria-web-app/issues',
            headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKKKKKEEEEEN}`
        },
        data : data
        };

        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            res.status(200).send(response.data)
        })
        .catch(function (error) {
            res.status(500).send(error)
            console.log(error);
        });
    }
}