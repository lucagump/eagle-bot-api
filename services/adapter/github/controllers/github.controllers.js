const axios = require('axios');
const { response } = require('express');

// Documentation
// https://docs.github.com/en/rest/

module.exports = {


    getRepositories: async function(req,res) {
        if (req.body.githubToken != null) {   
            
            var config = {
                method: 'get',
                url: 'https://api.github.com/orgs/eagletrt/repos',
                headers: { 
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `Bearer ${req.body.githubToken}`
                }
            };
            
            try {
                const repositories = (await axios(config)).data
                var response = []
                for (let index = 0; index < repositories.length; index++) {
                    response.push(repositories[index].name)
                } 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response
                })
            } catch (error) {
                console.log(error)
                return res.status(error.response.status).send({
                    status: 'fail',
                    statusCode: error.response.status,
                    errorMessage: error.response.data.message
                }) 
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    inviteOrganization: async function(req,res) {
        if (req.body.githubToken != null && req.body.email) {       
            
            var data = JSON.stringify({"email": req.body.email});
            var config = {
                method: 'post',
                url: 'https://api.github.com/orgs/eagletrt/invitations',
                headers: { 
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `Bearer ${req.body.githubToken}`
                },
            data : data
            };
            
            try {
                const response = (await axios(config)).data

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response
                })
            } catch (error) {
                console.log(error)
                return res.status(error.response.status).send({
                    status: 'fail',
                    statusCode: error.response.status,
                    errorMessage: error.response.data.message
                }) 
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    inviteCollaboration: async function(req,res) {
        if (req.body.githubToken != null && req.params.repository != null && req.params.username) {       
            
            var config = {
                method: 'put',
                url: 'https://api.github.com/repos/eagletrt/' + req.params.repository + '/collaborators/'+ req.params.username,
                headers: { 
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `Bearer ${req.body.githubToken}`
                }
            };
            try {
                const response = (await axios(config)).data
                
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response
                })        
            } catch (error) {
                console.log(error)
                return res.status(error.response.status).send({
                    status: 'fail',
                    statusCode: error.response.status,
                    errorMessage: error.response.data.message
                }) 
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getRepositoryTopics: async function(req,res){
        if (req.body.githubToken != null && req.params.repository != null) {       

            var config = {
                method: 'get',
                url: 'https://api.github.com/repos/eagletrt/'+req.params.repository+'/topics',
                headers: { 
                    'Accept': 'application/vnd.github.mercy-preview+json',
                    'Authorization': `Bearer ${req.body.githubToken}`
                }
            };
            
            try {
                const response = (await axios(config)).data
                var data = response.names                 

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: data
                })
            } catch (error) {
                console.log(error)
                return res.status(error.response.status).send({
                    status: 'fail',
                    statusCode: error.response.status,
                    errorMessage: error.response.data.message
                }) 
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },

    getRepositoryIssues: async function(req, res) {
        if (req.body.githubToken != null && req.params.repository != null) {       
            var config = {
                method: 'get',
                url: 'https://api.github.com/repos/eagletrt/'+req.params.repository+'/issues',
                headers: { 
                    Accept: 'application/vnd.github.v3+json',
                    Authorization: `Bearer ${req.body.githubToken}`
                }
            };
            
            try {
                var response = []
                const issues = (await axios(config)).data
                for (let index = 0; index < issues.length; index++) {
                    response.push({"number" : issues[index].number, "title" : issues[index].title, "description" : issues[index].body})
                }
                return res.status(201).send({
                    status: 'success',
                    statusCode: 201,
                    data: response
                })
            } catch (error) {
                console.log(error)
                return res.status(error.response.status).send({
                    status: 'fail',
                    statusCode: error.response.status,
                    errorMessage: error.response.data.message
                })                  
            }

        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    createGitHubIssue: async function(req, res) {
        if (req.body.githubToken != null && req.params.repository != null && req.body.title != null) {       
            
            var data = JSON.stringify({"title": req.body.title,"body": req.body.description,"labels":req.body.labels});
            var config = {
                method: 'post',
                url: 'https://api.github.com/repos/eagletrt/'+req.params.repository+'/issues',
                headers: { 
                    Accept: 'application/vnd.github.v3+json',
                    Authorization: `Bearer ${req.body.githubToken}`
                },
            data : data
            };
            
            try {
                const issue = await axios(config)
                var response = {
                    number: issue.data.number,                    
                    title: issue.data.title,                    
                    url: issue.data.url                    
                }
    
                return res.status(201).send({
                    status: 'success',
                    statusCode: 201,
                    data: response
                })
            } catch (error) {
                console.log(error)
                return res.status(error.response.status).send({
                    status: 'fail',
                    statusCode: error.response.status,
                    errorMessage: error.response.data.message
                })                 
            }

        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    assignGitHubIssue: async function(req, res) {
        if (req.body.githubToken != null && req.params.repository != null && req.params.issueID != null && req.body.username != null) {       
            
            var data = JSON.stringify({
                    "assignees": [req.body.username] 
                });
            var config = {
                method: 'post',
                url: 'https://api.github.com/repos/eagletrt/' + req.params.repository + '/issues/' + req.params.issueID + '/assignees',
                headers: { 
                    Accept: 'application/vnd.github.v3+json',
                    Authorization: `Bearer ${req.body.githubToken}`
                },
            data : data
            };
            
            try {
                const issue = (await axios(config)).data
                var response = {
                    number: issue.number,                    
                    title: issue.title,                    
                    url: issue.url                    
                }
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: response
                })
            } catch (error) {
                console.log(error)
                return res.status(error.response.status).send({
                    status: 'fail',
                    statusCode: error.response.status,
                    errorMessage: error.response.data.message
                })                   
            }

        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },




    getRepositoriesByTopics: async function(req,res){
        if (req.body.githubToken != null) {       
            var repositories = ['eagletrt.github.io','chimera-steeringwheel','chimera-bms','chimera-sensors','fenice-telemetria-sender','can-analyzer','telemetry-tools','api-swe','can-bus-id-generator','Matlab-data-viewer','telemetria-sender-fe','telemetria-sender-server','docker_control','eagletrt-telemetria-exporter','documentation']
            var repositoryContainsTag = ["volante","telemetria","fenice","chimera"]
            //var topics = req.body.topics
            var repositoriesWithTopics = {}
            try {
                // var repositories = await getReposistoryNameFromOrganization(req.body.githubToken)
                if (repositories == null || repositories.status != null){
                    return res.status(500).send('500 - Internal Server Error')     
                } 
                // console.log(repositories)
                repositories.forEach(async function(element) {
                    //var repositoryContainsTag = await getRepositoryTopics(req.body.githubToken,element)
                    if (repositoryContainsTag == null || repositoryContainsTag.status != null){
                        return res.status(500).send('500 - Internal Server Error')     
                    } 
                    //console.log(repositoryContainsTag) 
                    //var topics = req.body.topics
                    var topics = ["volante","telemetria"]
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
                })            
            } catch (error) {
                console.log(error)
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Repositories couldn\'t be found'
                })        
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    }

}