const axios = require('axios')

module.exports = {

    // From Application
    createTask: async function(req, res) {
        if(req.body.title != null && req.body.description != null && req.body.airtableToken != null && req.body.airtableBase != null){
            try {
                const members = (await axios.get(app_domain + '/airtable/members', {
                    data:{
                        'airtableToken': req.body.airtableToken,  
                        'airtableBase': req.body.airtableBase
                    }
                })).data
                
                if(members.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: task.statusCode,
                        errorMessage: task.errorMessage
                    })
                }                
                
                var membersInfos = []    
                members.forEach(element => {
                    if(element.fields.Group.includes(req.params.group)){
                        membersInfos.push({
                            id: element.id, 
                            name: element.fields.Collaborator.name,
                            groups: element.fields.Group,
                            tasks: element.fields.Tasks
                        })
                    } 
                });

                var minTask = membersInfos[0];      
                
                for (i = 0; i < membersInfos.length; i++){
                    if (minTask.tasks.length > (membersInfos[i].tasks).length) {
                        minTask = membersInfos[i];
                    }
                }
                
                const task = (await axios.post(app_domain + "/airtable/tasks",{
                    "title": req.body.title,
                    "description": req.body.description,
                    "assign": minTask.id,
                    "airtableToken": airtableToken,  
                    "airtableBase": airtableBase
                })).data
                
                if(task.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: task.statusCode,
                        errorMessage: task.errorMessage
                    })
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: task.data
                })
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
                // come funzionano le eccezioni qui? 
                return res.status(error.response.status).send({
                    status: 'fail',
                    statusCode: error.response.status,
                    errorMessage: error.response.data.errorMessage
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
        if(req.params.group != null && req.body.title != null && req.body.description != null) {
            try {
                const members = (await axios.get(app_domain + '/airtable/members', {
                    data:{
                        'airtableToken': req.body.airtableToken,  
                        'airtableBase': req.body.airtableBase
                    }
                })).data
                
                if(members.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: task.statusCode,
                        errorMessage: task.errorMessage
                    })
                }                
                
                var membersInfos = []    
                members.forEach(element => {
                    if(element.fields.Group.includes(req.params.group)){
                        membersInfos.push({
                            id: element.id, 
                            name: element.fields.Collaborator.name,
                            groups: element.fields.Group,
                            tasks: element.fields.Tasks
                        })
                    } 
                });

                var minTask = membersInfos[0];      
                
                for (i = 0; i < membersInfos.length; i++){
                    if (minTask.tasks.length > (membersInfos[i].tasks).length) {
                        minTask = membersInfos[i];
                    }
                }
                
                const task = (await axios.post(app_domain + "/airtable/tasks/groups/" + req.params.group,{
                    "title": req.body.title,
                    "description": req.body.description,
                    "group": req.params.group,
                    "assign": minTask.id,
                    "airtableToken": airtableToken,  
                    "airtableBase": airtableBase
                })).data
                
                if(task.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: task.statusCode,
                        errorMessage: task.errorMessage
                    })
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: task.data
                })
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
                // come funzionano le eccezioni qui? 
                return res.status(error.response.status).send({
                    status: 'fail',
                    statusCode: error.response.status,
                    errorMessage: error.response.data.errorMessage
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
    createIssueTask: async function(req, res) {
        if(req.body.groups && req.body.title != null && req.body.description != null && req.body.repository != null){

            try {
                
                // Member
                const members = (await axios.get(app_domain + '/airtable/members', {
                    data:{
                        'airtableToken': req.body.airtableToken,  
                        'airtableBase': req.body.airtableBase
                    }
                })).data
                
                if(members.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: task.statusCode,
                        errorMessage: task.errorMessage
                    })
                }                
                
                var membersInfos = []    
                members.forEach(element => {
                    if(element.fields.Group.includes(req.params.group)){
                        membersInfos.push({
                            id: element.id, 
                            name: element.fields.Collaborator.name,
                            groups: element.fields.Group,
                            tasks: element.fields.Tasks
                        })
                    } 
                });

                var minTask = membersInfos[0];      
                
                for (i = 0; i < membersInfos.length; i++){
                    if (minTask.tasks.length > (membersInfos[i].tasks).length) {
                        minTask = membersInfos[i];
                    }
                }

                // Task
                const airtableTask = (await axios.post(app_domain + "/airtable/tasks/groups/" + req.body.group,{
                    "title": req.body.title,
                    "description": req.body.description,
                    "assign": minTask.id,
                    "group": req.body.group,
                    "airtableToken": airtableToken,  
                    "airtableBase": airtableBase
                })).data
                
                if(airtableTask.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: airtableTask.statusCode,
                        errorMessage: airtableTask.errorMessage
                    })
                } 
                // Issue
                const githubIssue = await axios.post(app_domain + "/github/issues/"+req.body.repository,{
                    'title': req.body.title,
                    'description': req.body.description,
                    'labels': req.body.labels,
                    'githubToken': req.body.githubToken
                }).data

                if(githubIssue.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'Internal Server Error - ' + githubIssue.errorMessage
                    })
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
    createIssue: async function(req, res) {
        if(req.body.title != null && req.body.description != null && req.body.githubToken != null && req.body.repository != null){
            try {
                const githubIssue = await axios.post(app_domain + "/github/issues/"+req.body.repository,{
                    'title': req.body.title,
                    'description': req.body.description,
                    'labels': req.body.labels,
                    'githubToken': req.body.githubToken
                }).data

                if(githubIssue.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'Internal Server Error - ' + githubIssue.errorMessage
                    })
                }
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
    getGroupsRepositories: async function(req, res) {
        if(req.body.githubToken != null && req.body.topics != null){
            try {
                var topics = req.body.topics
                var repositoriesWithTopics = {}

                const repositories = (await axios.get(`https://api.github.com/orgs/eagletrt/repos`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `Bearer ${req.body.githubToken}`
                    }
                })).data

                if(repositories.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: repositories.statusCode,
                        errorMessage: 'Internal Server Error - ' + repositories.errorMessage
                    })
                } 

                for (let index = 0; index < repositories.length; index++) {
                    response.push(repositories[index].name)
                }

                repositories.forEach(async function(element) {
                    const repositoryContainsTag = (await axios.get(`https://api.github.com/repos/eagletrt/`+repository+`/topics`, {
                        headers: {
                            'Accept': 'application/vnd.github.mercy-preview+json',
                            'Authorization': `Bearer ${req.body.githubToken}`
                        }
                    })).data.names;

                    if(repositoryContainsTag.status == "fail"){
                        return res.status(500).send({
                            status: 'fail',
                            statusCode: repositoryContainsTag.statusCode,
                            errorMessage: 'Internal Server Error - ' + repositoryContainsTag.errorMessage
                        })
                    } 

                    //console.log(repositoryContainsTag) 
                    var result = []
                    for (let index = 0; index < topics.length; index++) {
                        if(repositoryContainsTag.includes(topics[index])){
                            result.push(topics[index])
                        }
                    }
                    repositoriesWithTopics[element] = result;
                });
                
                //console.log(repositoriesWithTopics)
                var response = {};
                for (const key in repositoriesWithTopics) {
                    for (const element of repositoriesWithTopics[key]) {
                        response[element] = response[element] ? [...response[element], key] : [key];
                    }
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

    // Airtable
    getMembers: async function(req, res) {
        if(req.body.userID != null){
            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data
                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const members = await axios.get(app_domain + '/airtable/members', {
                    data:{
                        'airtableToken': user.airtableToken,  
                        'airtableBase': user.airtableBase
                    }
                })
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
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data

                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 
                
                const member = await axios.get(app_domain + '/airtable/members/'+ req.params.username, {
                    data:{
                        'airtableToken': user.airtableToken,  
                        'airtableBase': user.airtableBase
                    }
                })

                if(member.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: member.statusCode,
                        errorMessage: 'Internal Server Error - ' + member.errorMessage
                    })
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: member.data
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
    assignTask: async function(req, res) {
        if(req.body.userID != null && req.body.username != null && req.params.taskID != null){
            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data

                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const assignTask = (await axios.put(app_domain + "/airtable/tasks/" + req.params.taskID,{
                    "username": req.body.username,
                    "airtableToken": user.airtableToken,  
                    "airtableBase": user.airtableBase
                })).data            
                
                if(assignTask.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: assignTask.statusCode,
                        errorMessage: 'Internal Server Error - ' + assignTask.errorMessage
                    })
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: assignTask.data
                })
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Internal Server Error'
                })
            }
        }else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getGroupTasks: async function(req, res) {
        if(req.params.userID != null && req.params.group){
            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.params.userID)).data

                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const groupTasks = (await axios.get(app_domain + '/airtable/tasks/groups/' + req.params.group, {
                    data:{
                        "airtableToken": user.airtableToken,
                        "airtableBase": user.airtableBase
                    }
                })).data
                
                if(groupTasks.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: groupTasks.statusCode,
                        errorMessage: 'Internal Server Error - ' + groupTasks.errorMessage
                    })
                } 
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: groupTasks.data
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
                const user = (await axios.get(app_domain + "/database/users/" + req.params.userID)).data

                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const tasks = (await axios.get(app_domain + '/airtable/tasks', {
                    data:{
                        'airtableToken': user.airtableToken,  
                        'airtableBase': user.airtableBase
                    }
                })).data
                
                if(tasks.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: tasks.statusCode,
                        errorMessage: 'Internal Server Error - ' + tasks.errorMessage
                    })
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: tasks.data
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

    
    // Github
    inviteCollaboration: async function(req, res) {
        if(req.body.userID != null && req.params.repository != null && req.params.username != null){
            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data
 
                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const invitation = (await axios.put(app_domain + "/github/repositories/"+req.params.repository+"/collaborators/"+req.params.username,{
                    'githubToken': user.githubToken
                })).data

                if(invitation.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: invitation.statusCode,
                        errorMessage: 'Internal Server Error - ' + invitation.errorMessage
                    })
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: invitation.data
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
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data

                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const invitation = (await axios.post(app_domain + "/github/users/githubInvitation",{
                    'email': req.body.email,
                    'githubToken': user.githubToken
                })).data

                if(invitation.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: invitation.statusCode,
                        errorMessage: 'Internal Server Error - ' + invitation.errorMessage
                    })
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: invitation.data
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
                const user = (await axios.get(app_domain + "/database/users/" + req.params.userID)).data

                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const repositories = (await axios.get(app_domain + "/github/repositories", {
                    data:{
                        'githubToken': user.githubToken
                    }
                })).data

                if(repositories.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: repositories.statusCode,
                        errorMessage: 'Internal Server Error - ' + repositories.errorMessage
                    })
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: repositories.data
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
    assignIssue: async function(req, res) {
        if(req.body.userID != null && req.body.username != null && req.body.repository != null && req.params.issueID != null){
            console.log(req.body)
            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data

                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 
                
                const assignIssue = (await axios.post(app_domain + "/github/repositories/" + req.body.repository + "/issues/" + req.params.issueID,{
                    "username": req.body.username, 
                    "githubToken": user.githubToken
                })).data

                if(assignIssue.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: assignIssue.statusCode,
                        errorMessage: 'Internal Server Error - ' + assignIssue.errorMessage
                    })
                } 

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
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data

                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const issues = (await axios.get(app_domain + "/github/issues/" + repository,{
                    data:{
                        'githubToken': githubToken
                    }
                })).data

                if(issues.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: issues.statusCode,
                        errorMessage: 'Internal Server Error - ' + issues.errorMessage
                    })
                } 
                
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: issues.data
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

}