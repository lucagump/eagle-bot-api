const axios = require('axios')

module.exports = {

    authenticateUser: async function(req, res) {
        if (req.body.userID != null && req.body.airtableToken != null && req.body.githubToken != null  && req.body.usernameGitHub != null && req.body.usernameTelegram != null && req.body.airtableBase != null) {   
            try {
                const userToCheck = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data

                if(userToCheck.status == "success"){
                    return res.status(202).send({
                        status: 'fail',
                        statusCode: 202,
                        errorMessage: 'Internal Server Error - User Already signed in '
                    })
                }  
                             
            } catch (error) {
                if(error.response.data.statusCode == 404) {
                    
                    const member = (await axios.get(app_domain + '/airtable/members/' + req.body.usernameGitHub, {
                        data:{
                            "airtableToken": req.body.airtableToken,
                            "airtableBase": req.body.airtableBase
                        }
                    })).data
                    
                    if(member.status == "fail"){
                        return res.status(member.statusCode).send({
                            status: member.status,
                            statusCode: member.statusCode,
                            errorMessage: 'Internal Server Error - ' + member.errorMessage
                        })
                    }                
                    
                    const user = (await axios.post(app_domain + '/database/users',{
                        userID: req.body.userID,
                        chatID: req.body.chatID,
                        usernameTelegram: req.body.usernameTelegram,
                        usernameGitHub: req.body.usernameGitHub,
                        groups: member.data.groups,
                        githubToken: req.body.githubToken,
                        airtableToken: req.body.airtableToken,
                        airtableBase: req.body.airtableBase
                    })).data
                    
                    if(user.status == "fail"){
                        return res.status(202).send({
                            status: user.status,
                            statusCode: user.statusCode,
                            errorMessage: 'Internal Server Error - ' + user.errorMessage
                        })
                    }         
    
                    return res.status(201).send({
                        status: 'success',
                        statusCode: 201,
                        data: user.data
                    })
                } else {
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'User couldn\'t be created'
                    })
                }
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                errorMessage: 'Bad Request'
            })
        }
    },
    getUser: async function(req, res) {
        if (req.params.userID != null) {   
            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.params.userID)).data

                if(user.status == "fail"){
                    return res.status(404).send({
                        status: 'fail',
                        statusCode: 404,
                        errorMessage: 'Can\'t find your info'
                    })
                }      
                console.log(user)
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: user.data
                  })
            } catch (error) {
                console.log(error)
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'User couldn\'t be found'
                  })
            }
        }else{
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                errorMessage: 'Bad Request'
            })
        }
    },
    logout: async function(req, res) {
        if (req.params.userID != null) {
            try {
                const response = (await axios.delete(app_domain + "/database/users/" + req.params.userID)).data
                if(response.statusCode == 404){
                    return res.status(202).send({
                        status: 'fail',
                        statusCode: 202,
                        errorMessage: 'User is already logged out'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response.data
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
                errorMessage: 'Bad Request'
            })
        }
    },
 

    createTask: async function(req,res) {
        if(req.body.userID != null && req.body.title != null && req.body.description != null ){
            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data
                
                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const task = (await axios.post(app_domain + "/business/tasks", {
                    "title": req.body.title,
                    "description": req.body.description,
                    "airtableToken": user.data.airtableToken,  
                    "airtableBase": user.data.airtableBase
                })).data

                if(task.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: task.statusCode,
                        errorMessage: 'Internal Server Error - ' + task.errorMessage
                    })
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response.data
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
                errorMessage: 'Bad Request'
            })
        }
    },
    createGroupTask: async function(req,res) {
        if(req.body.userID != null && req.body.title != null && req.body.description != null && req.params.groups != null){
            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data
                
                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const task = (await axios.post(app_domain + "/business/tasks/" + req.params.groups, {
                    "title": req.body.title,
                    "description": req.body.description,
                    "groups": req.params.groups,
                    "airtableToken": user.data.airtableToken,  
                    "airtableBase": user.data.airtableBase
                })).data

                if(task.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: 500,
                        errorMessage: 'Internal Server Error - ' + task.errorMessage
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
                errorMessage: 'Bad Request'
            })
        }
    },
    createIssue: async function(req,res) {
        if(req.body.userID != null && req.body.repository != null && req.body.title != null && req.body.description != null ){
            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data
                
                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const issue = (await axios.post(app_domain + "/business/issues", {
                    "title": req.body.title,
                    "description": req.body.description,
                    "repository": req.body.repository,
                    "githubToken": user.data.githubToken
                })).data

                if(issue.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: issue.statusCode,
                        errorMessage: 'Internal Server Error - ' + issue.errorMessage
                    })
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: issue.data
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
                errorMessage: 'Bad Request'
            })
        }
    },
 
    
    createProblem: async function(req, res) {
        if(req.body.userID != null && req.body.title != null && req.body.groups != null && req.body.description != null && req.body.repository != null){

            try {
                const user = (await axios.get(app_domain + "/database/users/" + req.body.userID)).data
                
                if(user.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: user.statusCode,
                        errorMessage: 'Internal Server Error - ' + user.errorMessage
                    })
                } 

                const problem = (await axios.post(app_domain + "/business/problems", {
                    "title": req.body.title,
                    "description": req.body.description,
                    "repository": req.body.repository,
                    "groups": req.body.groups,
                    "githubToken": user.data.githubToken,  
                    "airtableToken": user.data.airtableToken,  
                    "airtableBase": user.data.airtableBase
                })).data

                if(problem.status == "fail"){
                    return res.status(500).send({
                        status: 'fail',
                        statusCode: problem.statusCode,
                        errorMessage: 'Internal Server Error - ' + problem.errorMessage
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: problem.data
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

                const repositories = (await axios.get(app_domain + "/business/topics/repositories", {
                    data:{
                    'githubToken': user.data.githubToken,
                    'topics': user.data.groups
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
    }

}