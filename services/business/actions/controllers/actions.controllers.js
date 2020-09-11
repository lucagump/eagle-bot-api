const axios = require('axios')

async function databasePostUser(req,groups){
    try {
        const response = await axios.post(app_domain + '/database/users',{
            userID: req.body.userID,
            chatID: req.body.chatID,
            usernameTelegram: req.body.usernameTelegram,
            usernameGitHub: req.body.usernameGitHub,
            groups: groups,
            githubToken: req.body.githubToken,
            airtableToken: req.body.airtableToken,
            airtableBase: req.body.airtableBase
         });
        return response.data
    } catch (error) {
        return error
    }
}
async function databaseGetUser(userID){
    try {
        const response = await axios.get(app_domain + "/database/users/" + userID)
        return response.data
    } catch (error) {
        return error
    }  
}
async function databaseDeleteUser(req){
    try {
        const response = await axios.delete(app_domain + "/database/users/" + req.params.userID)
        return response.data
    } catch (error) {
        return error
    }  
}


async function githubRepositories(githubToken){
    try {
        const response = await axios.get(app_domain + "/github/repositories", {
            data:{
                'githubToken': githubToken
            }
        })
        return response.data
    } catch (error) {
        return error
    }  
}
async function githubRepositoriesByGroup(githubToken,groups){
    try {
        const response = await axios.get(app_domain + "/github/repositories/topics", {
            data:{
            'githubToken': githubToken,
            'topics': groups
            }
        })
        return response.data
    } catch (error) {
        return error
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
        return error
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
        return error
    }  
}
async function sendCollaborationInvite(githubToken,req){
    try {
        const response = await axios.put(app_domain + "/github/repositories/"+req.params.repository+"/collaborators/"+req.params.username,{
            'githubToken': githubToken
        })
        return response
    } catch (error) {
        return error
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
        return error
    }  
}   
async function createAirTableGroupTask(req,airtableToken,airtableBase){
    try {
        const response = await axios.post(app_domain + "/airtable/tasks/"+req.params.group,{
            "title": req.body.title,
            "description": req.body.description,
            "airtableToken": airtableToken,  
            "airtableBase": airtableBase
        });
        return response
    } catch (error) {
        return error
    }  
}
async function createAirTableTask(req,airtableToken,airtableBase){
    try {
        const response = await axios.post(app_domain + "/airtable/tasks",{
            "title": req.body.title,
            "description": req.body.description,
            "airtableToken": airtableToken,  
            "airtableBase": airtableBase
        });
        return response
    } catch (error) {
        return error
    }  
}
async function assignTask(req,airtableToken,airtableBase){
    try {
        const response = await axios.put(app_domain + "/airtable/tasks/" + req.params.taskID,{
            "username": req.body.username,
            "airtableToken": airtableToken,  
            "airtableBase": airtableBase
        })
        return response
    } catch (error) {
        return error
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
        return error
    }  
}

async function getGroupTasks(group,airtableToken,airtableBase){

    try {
        const response = await axios.get(app_domain + '/airtable/tasks/groups/' + group, {
            data:{
                "airtableToken": airtableToken,
                "airtableBase": airtableBase
            }
        })
        return response.data
    } catch (error) {
        return error
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
        return error
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
        return error
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
        return error
    }  
}
   

module.exports = {

    // DATABASE
    addUserToDataBase: async function(req, res) {
        if (req.body.userID != null && req.body.airtableToken != null && req.body.githubToken != null  && req.body.usernameGitHub != null && req.body.usernameTelegram != null && req.body.airtableBase != null) {   
            try {
                const member = await getMember(req.body.airtableToken,req.body.airtableBase,req.body.usernameGitHub)
                const response = await databasePostUser(req,member.groups)
                if(response.name == "Error"){
                    return res.status(500).send(response.message)
                }
                if(response == "202 - User is already in database"){
                    return res.status(202).send(response)
                }        
                res.status(201).send(response);
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getUserFromDataBase: async function(req, res) {
        if (req.params.userID != null) {   
            try {
                const response = await databaseGetUser(req.params.userID)
                if(response.name == "Error"){
                    return res.status(404).send(response.message)
                }
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response
                })
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    deleteUserFromDataBase: async function(req, res) {
        if (req.params.userID != null) {
            try {
                const response = await databaseDeleteUser(req)
                if(response.name == "Error"){
                    return res.status(404).send(response.message)
                }
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response
                })
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },


    // AIRTABLE
    createTask: async function(req, res) {
        if(req.body.userID != null && req.body.title != null && req.body.description != null){
            try {
                const user = await databaseGetUser(req.body.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const airtableTask = await createAirTableTask(req,user.airtableToken,user.airtableBase)
                if(airtableTask.name == "Error"){
                    return res.status(502).send(airtableTask.message)
                }

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: airtableTask.data
                })
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    createGroupTask: async function(req, res) {
        if(req.body.userID != null && req.params.group != null && req.body.title != null && req.body.description != null){
            try {
                const user = await databaseGetUser(req.body.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const airtableTask = await createAirTableGroupTask(req,user.airtableToken,user.airtableBase)
                if(airtableTask.name == "Error"){
                    return res.status(500).send(airtableTask.message)
                }
                
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: airtableTask.data
                })
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    assignTask: async function(req, res) {
        try {
            const user = await databaseGetUser(req.body.userID)
            if(user.name == "Error"){
                return res.status(401).send("401 - User not Authorized")
            }
            const airtableTask = await assignTask(req,user.airtableToken,user.airtableBase)
            if(airtableTask.name == "Error"){
                return res.status(500).send(airtableTask.message)
            }
            return res.status(200).send({
                status: 'success',
                statusCode: 200,
                data: airtableTask.data
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                status: 'fail',
                statusCode: 500,
                errorMessage: 'Internal Server Error'
            })
        }
    },
    getGroupTasks: async function(req, res) {
        if(req.params.userID != null && req.params.group){
            try {
                const user = await databaseGetUser(req.params.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const tasks = await getGroupTasks(req.params.group,user.airtableToken,user.airtableBase)
                if(tasks.name == "Error"){
                    return res.status(500).send(tasks.message)
                }

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: tasks
                });
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },    
    getTasks: async function(req, res) {
        if(req.params.userID != null){
            try {
                const user = await databaseGetUser(req.params.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const tasks = await getTasks(user.airtableToken,user.airtableBase)
                if(tasks.name == "Error"){
                    return res.status(500).send(tasks.message)
                }

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: tasks
                });
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getMembers: async function(req, res) {
        if(req.body.userID != null){
            try {
                const user = await databaseGetUser(req.body.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const members = await getMembers(user.airtableToken,user.airtableBase)
                if(members.name == "Error"){
                    return res.status(500).send(members.message)
                }

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: members
                })
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getMember: async function(req, res) {
        if(req.body.userID != null && req.params.username != null){
            try {
                const user = await databaseGetUser(req.body.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const member = await getMember(user.airtableToken,user.airtableBase,req.params.username)
                if(member.name == "Error"){
                    return res.status(500).send(member.message)
                }

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: member
                });
            } catch (error) {
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    
    // GITHUB
    inviteCollaboration: async function(req, res) {
        if(req.body.userID != null && req.params.repository != null && req.params.username != null){
            try {
                const user = await databaseGetUser(req.body.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const response = await sendCollaborationInvite(user.githubToken,req)
                if(response.status == 204){
                    return res.status(204).send("204 - User is already a Collaborator")
                }
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response.data
                });
            } catch (error) {
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    inviteOrganization: async function(req, res) {
        if(req.body.userID != null && req.body.email != null){
            try {
                const user = await databaseGetUser(req.body.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const response = await sendOrganizationInvite(user.githubToken,req)
                console.log(response)
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response
                });
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getRepositories: async function(req, res) {
        if(req.params.userID != null){
            try {
                const user = await databaseGetUser(req.params.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const repositories = await githubRepositories(user.githubToken)
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: repositories
                });
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    createIssue: async function(req, res) {
        if(req.body.userID != null && req.body.title != null && req.body.description != null && req.body.repository != null){
            try {
                const user = await databaseGetUser(req.body.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const githubIssue = await createGitHubIssue(req,user.githubToken)
                var response = {
                    "githubIssue": githubIssue.url
                }
                await res.status(201).send(response);
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    assignIssue: async function(req, res) {
        if(req.body.userID != null && req.body.username != null && req.body.repository != null && req.params.issueID != null){
            console.log(req.body)
            try {
                const user = await databaseGetUser(req.body.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const githubIssue = await assignIssue(req,user.githubToken)
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: githubIssue
                });
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getIssues: async function(req, res) {
        if(req.body.userID != null && req.params.repository != null) {
            try {
                const user = await databaseGetUser(req.body.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const issues = await getIssues(user.githubToken,req.params.repository)
                if(issues.name == "Error"){
                    return res.status(404).send("404 - Repository not Found")
                }
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: issues
                });
            } catch (error) {
                console.log(error);
                                        return res.status(500).send({
                            status: 'fail',
                            statusCode: 500,
                            errorMessage: 'Internal Server Error'
                          })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },

    // GITHUB - GROUPS - AIRTABLE
    createIssueTask: async function(req, res) {
        if(req.body.userID != null && req.body.title != null && req.body.description != null && req.body.repository != null){

            try {
                const user = await databaseGetUser(req.body.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const githubIssue = await createGitHubIssue(req,user.githubToken)

                const airtableTask = await createAirTableTask(req,user.airtableToken,user.airtableBase)
                
                if(airtableTask.name == "Error"){
                    return res.status(500).send(airtableTask.message)
                }

                var response = {
                    "githubIssue": githubIssue.url,
                    "airtableTask": airtableTask.data.id
                }
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response
                });
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getGroupsRepositories: async function(req, res) {
        if(req.params.userID != null){
            try {
                const user = await databaseGetUser(req.params.userID)
                if(user.name == "Error"){
                    return res.status(401).send("401 - User not Authorized")
                }
                const repositories = await githubRepositoriesByGroup(user.githubToken,user.groups)
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: repositories
                });
            } catch (error) {
                console.log(error);
                                        return res.status(500).send({
                            status: 'fail',
                            statusCode: 500,
                            errorMessage: 'Internal Server Error'
                          })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    }
}