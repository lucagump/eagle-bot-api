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
    //console.log(error.config);
    
    return error 
}
async function sendMessage(req){
    try {
        const response = await axios.get(app_domain + '/telegram/test')
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
async function githubRepositories(githubToken,groups){
    try {
        const response = await axios.get(app_domain + "/github/repositories", {
            'githubToken': githubToken
        })
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
async function githubRepositoriesByGroup(githubToken,groups){
    try {
        const response = await axios.get(app_domain + "/github/repositories/topics", {
            'githubToken': githubToken,
            'topics': groups
        })
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
async function getIssues(githubToken,repository){
    try {
        const response = await axios.get(app_domain + "/github/issues/" + repository,{
            data:{
                'githubToken': githubToken
            }
        })
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
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
async function createAirTableTask(req,airtableToken,airtableBase){
    try {
        const response = await axios.post(app_domain + "/airtable/tasks/" + req.body.group,{
            data:{
                "title": req.body.title,
                "desctiption": req.body.description,
                "airtableToken": airtableToken,  
                "airtableBase": airtableBase
            }
        });
        return response
    } catch (error) {
        handleError(error)
    }  
}
async function assignTask(req,airtableToken,airtableBase){
    try {
        const response = await axios.post(app_domain + "/airtable/tasks/" + req.params.taskID,{
            data: {
                "username": req.body.username,
                "airtableToken": airtableToken,  
                "airtableBase": airtableBase
            }
        })
        return response.data
    } catch (error) {
        handleError(error)
    }  
}
async function assignIssue(req,githubToken){
    try {
        const response = await axios.post(app_domain + "/github/repositories/" + req.body.repository + "/issues/" + req.params.issueID,{
            "username": req.body.username, 
            "githubToken": githubToken
        })
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
async function getGroupTasks(group,airtableToken,airtableBase){

    try {
        const response = await axios.get(app_domain + '/airtable/tasks/' + group, {
            data:{
                "airtableToken": airtableToken,
                "airtableBase": airtableBase
            }
        })
        return response.data
    } catch (error) {
        return handleError(error)
    }  
}
async function getTasks(airtableToken,airtableBase){
    try {
        const response = await axios.get(app_domain + '/airtable/tasks', {
            data:{
                'airtableToken': airtableToken,  
                'airtableBase': airtableBase
            }
        })
        return response.data
    } catch (error) {
        return handleError(error)
    }  
}
async function getMember(airtableToken,airtableBase,username){

    try {
        const response = await axios.get(app_domain + '/airtable/members/' + username, {
            data:{
                "airtableToken": airtableToken,
                "airtableBase": airtableBase
            }
        })
        return response.data
    } catch (error) {
        return handleError(error)
    }  
}
async function getMembers(airtableToken,airtableBase){
    try {
        const response = await axios.get(app_domain + '/airtable/members', {
            data:{
                'airtableToken': airtableToken,  
                'airtableBase': airtableBase
            }
        })
        return response.data
    } catch (error) {
        return handleError(error)
    }  
}
async function databaseGetUser(userID){
    try {
        const response = await axios.get(app_domain + "/database/users/" + userID)
        return response.data
    } catch (error) {
        return handleError(error)
    }  
}
async function databaseDeleteUser(req){
    try {
        const response = await axios.delete(app_domain + "/database/users/" + req.params.userID)
        return response
    } catch (error) {
        handleError(error)
    }  
}
async function sendCollaborationInvite(githubToken,req){
    try {
        const response = await axios.put(app_domain + "/github/repositories/"+req.params.repository+"/collaborators/"+req.params.username,{
            'githubToken': githubToken
        })
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
            const response = await databaseGetUser(req.params.userID)
            res.status(200).send(response);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    deleteUserFromDataBase: async function(req, res) {
        try {
            const response = await databaseDeleteUser(req)
            res.status(200).json(response.data)
        } catch (error) {
            console.log(error)
            if(error.status == 404){                
                res.status(404).send('404 - User not Found')
            } else {
                res.status(500).send('500 - Internal Server Error')
            }
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
            const user = await databaseGetUser(req.params.userID)
            const repositories = await githubRepositories(user.githubToken)
            await res.status(200).send(repositories);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    getGroupsRepositories: async function(req, res) {
        try {
            const user = await databaseGetUser(req.params.userID)
            const repositories = await githubRepositoriesByGroup(user.githubToken,user.groups)
            await res.status(200).send(repositories);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    getGroupTasks: async function(req, res) {
        try {
            const user = await databaseGetUser(req.params.userID)
            const tasks = await getGroupTasks(req.params.group,user.airtableToken,user.airtableBase)
            console.log("       +-+-+-+++++++---++++++++++++            "+tasks)
            await res.status(200).send(tasks);
        } catch (error) {
            res.status(500).send('500 - Internal Server Error')
        }
    },    
    getTasks: async function(req, res) {
        try {
            const user = await databaseGetUser(req.params.userID)
            const tasks = await getTasks(user.airtableToken,user.airtableBase)
            await res.status(200).send(tasks);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    getMembers: async function(req, res) {
        try {
            const user = await databaseGetUser(req.body.userID)
            const members = await getMembers(user.airtableToken,user.airtableBase)
            await res.status(200).send(members);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    getMember: async function(req, res) {
        try {
            const user = await databaseGetUser(req.body.userID)
            const member = await getMember(user.airtableToken,user.airtableBase,req.params.username)
            await res.status(200).send(member);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    getIssues: async function(req, res) {
        try {
            const user = await databaseGetUser(req.body.userID)
            const issues = await getIssues(user.githubToken,req.params.repository)
            await res.status(200).send(issues);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    inviteCollaboration: async function(req, res) {
        try {
            const user = await databaseGetUser(req.body.userID)
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
            const user = await databaseGetUser(req.body.userID)
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
            const user = await databaseGetUser(req.body.userID)
            const githubIssue = await createGitHubIssue(req,user.githubToken)
            var response = {
                "githubIssue": githubIssue.url
            }
            await res.status(200).send(response);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    createTask: async function(req, res) {
        try {
            const user = await databaseGetUser(req.body.userID)
            const airtableTask = await createAirTableTask(req,user.airtableToken,user.airtableBase)
            var response = {
                "airtableTask": airtableTask.id
            }
            await res.status(200).send(response);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    assignTask: async function(req, res) {
        try {
            const user = await databaseGetUser(req.body.userID)
            const airtableTask = await assignTask(req,user.airtableToken,user.airtableBase)
            await res.status(200).send(airtableTask);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    assignIssue: async function(req, res) {
        console.log(req.body)
        try {
            const user = await databaseGetUser(req.body.userID)
            const githubIssue = await assignIssue(req,user.githubToken)
            await res.status(200).send(githubIssue);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },
    createIssueTask: async function(req, res) {
        try {
            const user = await databaseGetUser(req.body.userID)
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
    }
}