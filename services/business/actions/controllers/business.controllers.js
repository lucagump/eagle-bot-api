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
                var membersData = members.data
                var minTask = membersData[0];      

                membersData.forEach(element => {
                    if (minTask.tasks.length > element.tasks.length) {
                        minTask = element;
                    }
                });
     
                
                const task = (await axios.post(app_domain + "/airtable/tasks",{
                    "title": req.body.title,
                    "description": req.body.description,
                    "assign": minTask.id,
                    'airtableToken': req.body.airtableToken,  
                    'airtableBase': req.body.airtableBase
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
        if(req.params.groups != null && req.body.title != null && req.body.description != null) {
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
                var membersData = members.data

                membersData.forEach(element => {
                    if(element.groups.includes(req.params.groups)){
                        membersInfos.push({
                            id: element.id, 
                            name: element.name,
                            groups: element.groups,
                            tasks: element.tasks
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
                const task = (await axios.post(app_domain + "/airtable/tasks/" + req.params.groups,{
                    "title": req.body.title,
                    "description": req.body.description,
                    "groups": req.params.groups,
                    "assign": minTask.id,
                    'airtableToken': req.body.airtableToken,  
                    'airtableBase': req.body.airtableBase
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
        if(req.body.groups != null && req.body.title != null && req.body.description != null && req.body.repository != null){

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
                var membersData = members.data

                membersData.forEach(element => {
                    if(element.groups.includes(req.body.groups)){
                        membersInfos.push({
                            id: element.id, 
                            name: element.name,
                            groups: element.groups,
                            tasks: element.tasks
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
                const airtableTask = (await axios.post(app_domain + "/airtable/tasks/" + req.body.groups,{
                    "title": req.body.title,
                    "description": req.body.description,
                    "assign": minTask.id,
                    "groups": req.body.groups,
                    'airtableToken': req.body.airtableToken,  
                    'airtableBase': req.body.airtableBase
                })).data
                
                if(airtableTask.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: airtableTask.statusCode,
                        errorMessage: airtableTask.errorMessage
                    })
                } 
                // Issue
                const githubIssue = (await axios.post(app_domain + "/github/issues/"+req.body.repository,{
                    'title': req.body.title,
                    'description': req.body.description,
                    'labels': req.body.labels,
                    'githubToken': req.body.githubToken
                })).data

                if(githubIssue.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'Internal Server Error - ' + githubIssue.errorMessage
                    })
                }
                var response = {
                    "githubIssue": githubIssue.data.url,
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
                const githubIssue = (await axios.post(app_domain + "/github/issues/"+req.body.repository,{
                    'title': req.body.title,
                    'description': req.body.description,
                    'labels': req.body.labels,
                    'githubToken': req.body.githubToken
                })).data
                
                if(githubIssue.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'Internal Server Error - ' + githubIssue.errorMessage
                    })
                }
                var response = {
                    "githubIssue": githubIssue.data.url
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
    getGroupsRepositories: async function(req, res) {
        if(req.body.githubToken != null && req.body.topics != null){
            try {
                var topics = req.body.topics
                var repositoriesWithTopics = {}
                
                const response = (await axios.get(app_domain + "/github/repositories", {
                    data:{
                        'githubToken': req.body.githubToken
                    }
                })).data

                if(response.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: response.statusCode,
                        errorMessage: 'Internal Server Error - ' + response.errorMessage
                    })
                } 
                var repositories = response.data
            
                for (let index = 0; index < repositories.length; index++) {
                    const element = repositories[index];

                    var repositoryContains = (await axios.get(app_domain + "/github/repositories/"+element+"/topics", {
                        data:{
                            'githubToken': req.body.githubToken
                        }
                    })).data

                    if(repositoryContains.status == "fail"){
                        return res.status(500).send({
                            status: 'fail',
                            statusCode: repositoryContains.statusCode,
                            errorMessage: 'Internal Server Error - ' + repositoryContains.errorMessage
                        })
                    } 
                    var repositoryContainsTag = repositoryContains.data
            
                    var result = []
                    for (let indey = 0; indey < topics.length; indey++) {
                        if(repositoryContainsTag.includes(topics[indey])){
                            result.push(topics[indey])
                        }
                    }
                    if(result.length > 0){
                        repositoriesWithTopics[element] = result;
                    }
                };
                
                var responseInverted = {};
                for (const key in repositoriesWithTopics) {
                    for (const element of repositoriesWithTopics[key]) {
                        responseInverted[element] = responseInverted[element] ? [...responseInverted[element], key] : [key];
                    }
                }
                
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: responseInverted
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
                        'airtableToken': user.data.airtableToken,  
                        'airtableBase': user.data.airtableBase
                    }
                })
                if(members.name == "Error"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: members.statusCode,
                        errorMessage: 'Internal Server Error - ' + members.errorMessage
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: members.data
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
                        'airtableToken': user.data.airtableToken,  
                        'airtableBase': user.data.airtableBase
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
                if( error.response.data.statusCode == 404 )
                return res.status(404).send({
                    status: 'fail',
                    statusCode: error.response.data.statusCode,
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
                    "airtableToken": user.data.airtableToken,  
                    "airtableBase": user.data.airtableBase
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
        if(req.params.userID != null && req.params.groups){
            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.params.userID)).data

                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const groupTasks = (await axios.get(app_domain + '/airtable/tasks/groups/' + req.params.groups, {
                    data:{
                        "airtableToken": user.data.airtableToken,
                        "airtableBase": user.data.airtableBase
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
                        'airtableToken': user.data.airtableToken,  
                        'airtableBase': user.data.airtableBase
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
                    'githubToken': user.data.githubToken
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
                    'githubToken': user.data.githubToken
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
                        'githubToken': user.data.githubToken
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
                    "githubToken": user.data.githubToken
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
                    data: assignIssue.data
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

                const issues = (await axios.get(app_domain + "/github/issues/" + req.params.repository,{
                    data:{
                        'githubToken': user.data.githubToken
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
                if(error.response.data.statusCode == 404) {
                    return res.status(404).send({
                        status: 'fail',
                        statusCode: error.response.data.statusCode,
                        errorMessage: error.response.data.errorMessage
                    })
                }
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