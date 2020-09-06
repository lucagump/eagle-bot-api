const axios = require('axios')
const errors = require('../common/errors');

function handleError(error){

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        //return errors.OK
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
    //return errors.INTERNALSERVER
    console.log(error.config);
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

async function createGitHubIssue(req,githubToken){
    try {
        const response = await axios.post(app_domain + "/github/issues/"+req.body.repository,{
            'title': req.body.title,
            'description': req.body.description,
            'labels': req.body.labels,
            'repository': req.body.repository,
            'githubToken': githubToken
        })
        console.log("actions/createGitHubIssue -> Issue Created");
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
async function createAirTableTask(req,airtableToken,airtableBase){
    try {
        const response = await axios.post(app_domain + "/airtable/tasks/" + req.body.groups,{
            "title": req.body.title,
            "desctiption": req.body.description,
            "airtableToken": airtableToken,  
            "airtableBase": airtableBase
        })
        console.log("actions/createAirTableTask");
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
async function databasePostUser(req){
    try {
        console.log("actions/databasePostUser -> Token Found");
        const response = await axios.post(app_domain + '/database/users',{
            userID: req.body.userID,
            chatID: req.body.chatID,
            usernameTelegram: req.body.usernameTelegram,
            usernameGitHub: req.body.usernameGitHub,
            groups: req.body.groups,
            githubToken: req.body.githubToken,
            airtableToken: req.body.airtableToken,
            airtableBase: req.body.airtableBase
         });
        return response.data
    } catch (error) {
        handleError(error)
    }
}
async function databaseGetUser(req){
    try {
        const response = await axios.get(app_domain + "/database/users/" + req.body.userID)
        console.log("actions/databaseGetUser");
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
async function databaseDeleteUser(req){
    try {
        const response = await axios.delete(app_domain + "/database/users/" + req.params.userID)
        console.log("actions/getToken -> Token Found");
        return response.data

    } catch (error) {
        console.log(error)
    }  
}
async function sendCollaborationInvite(githubToken,req){
    try {
        const response = await axios.put(app_domain + "/github/repositories/"+req.params.repository+"/collaborators/"+req.params.username,{
            'githubToken': githubToken
        })
        console.log("actions/sendCollaborationInvite");
        return response
    } catch (error) {
        handleError(error)
    }  
}
async function sendOrganizationInvite(githubToken,req){
    try {
        const response = await axios.post(app_domain + "/github/users/githubInvitation",{
            'email': req.body.email,
            'githubToken': githubToken
        })
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
            

module.exports = {

    addUserToDataBase: async function(req, res) {
        try {
            const message = await databasePostUser(req)
            await res.status(200).send(message);
        } catch (error) {
            res.status(500).send('500 - Internal Server Error')
            console.log(error);
        }
    },
    
    getUserFromDataBase: async function(req, res) {
        try {
            const message = await databaseGetUser(req)
            res.status(200).send(message);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },

    deleteUserFromDataBase: async function(req, res) {
        try {
            const message = await databaseDeleteUser(req)
            res.status(200).send(message);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },

    sendMessage: async function(req, res) {
        try {
            const message = await this.sendMessage(req)
            await res.status(200).send(message);
        } catch (error) {
            res.status(500).send('500 - Internal Server Error')
            console.log(error);
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

    addGroup: async function(req, res) {
        try {
            const user = await databaseGetUser(req)
            const repos = await repositories(user.githubToken)
            // controllo sulle repo il tag divido l'array e faccio in post la chiamata al db
            //const user = await getUserToken(req)
            await res.status(200).send(repos);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },

    inviteCollaboration: async function(req, res) {
        try {
            const user = await databaseGetUser(req)
            const response = await sendCollaborationInvite(user.githubToken,req)
            if(response.status == 204){
                response.data="204 - User is already a Collaborator"
            }
            res.status(response.status).send(response.data)
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },

    inviteOrganization: async function(req, res) {
        try {
            const user = await databaseGetUser(req)
            const response = await sendOrganizationInvite(user.githubToken,req)
            console.log(response)
            await res.status(200).send(response);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },

    createIssue: async function(req, res) {
        try {
            const user = await databaseGetUser(req)
            const githubIssue = await createGitHubIssue(req,user.githubToken)
            const airtableTask = await createAirTableTask(req,user.airtableToken,user.airtableBase)
            var response = {
                "githubIssue": githubIssue.url,
                "airtableTask": airtableTask.id
            }
            await res.status(200).send(response);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    // da fare e testare, airtable forse va controllare parametri
    getIssues: async function(req, res) {
        try {
            const user = await databaseGetUser(req)
            //const githubIssues = await getGitHubIssues(req,user.githubToken)
            const airtableTasks = await getAirTableTasks(req,user.airtableToken,user.airtableBase)
            var response = {
                "githubIssues": ['githubIssues'],
                "airtableTasks": airtableTasks
            }
            await res.status(200).send(response);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    }
}