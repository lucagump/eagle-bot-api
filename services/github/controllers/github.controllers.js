const axios = require('axios')

// Documentation
// https://docs.github.com/en/rest/

async function getRepositoryTopics(githubToken, repository) {
    try {
        const response = await axios.get(`https://api.github.com/repos/eagletrt/`+repository+`/topics`, {
            headers: {
                'Accept': 'application/vnd.github.mercy-preview+json',
                'Authorization': `Bearer ${githubToken}`
            }
        });
        repositoryTopics = response.data.names 
        return repositoryTopics
    } catch (error) {
        var response = []
        response.status = error.response.status 
        response.message = error.response.data.message 
        return response
    }  
}
async function getInviteOrganization(req) {

    var data = JSON.stringify({"email": req.body.email});
    var config = {
        method: 'post',
        url: 'https://api.github.com/orgs/eagletrt/invitations',
        headers: { 
            Accept: 'application/vnd.github.v3+json',
            Authorization: `Bearer ${req.body.githubToken}`
        },
    data : data
    };
    try {
        const response = await axios(config)
        return "200 - Invitation Sent Correctly"
    } catch (error) {
        var response = []
        response.status = error.response.status 
        response.message = error.response.data.message 
        return response
    }  
}
async function getInviteCollaboration(req) {
    var config = {
        method: 'put',
        url: 'https://api.github.com/repos/eagletrt/' + req.params.repository + '/collaborators/'+ req.params.username,
        headers: { 
            Accept: 'application/vnd.github.v3+json',
            Authorization: `Bearer ${req.body.githubToken}`
        }
    };
    try {
        const response = await axios(config)
        return response
    } catch (error) {
        var response = []
        response.status = error.response.status 
        response.message = error.response.data.message 
        return response
    }  
}
async function getReposistoryNameFromOrganization(githubToken) {
    var response = []
    try {
        const repositories = (await axios.get(`https://api.github.com/orgs/eagletrt/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${githubToken}`
            }
        })).data
        
        for (let index = 0; index < repositories.length; index++) {
            response.push(repositories[index].name)
        }
        
        return response   
    } catch (error) {
        response.status = error.response.status 
        response.message = error.response.data.message 
        return response
    }  
}


module.exports = {


    getRepositories: async function(req,res) {
        if (req.body.githubToken != null) {       
            try {
                const response = await getReposistoryNameFromOrganization(req.body.githubToken)
                
                if(response.status != null){
                    return res.status(response.status).send(response.status + " " + response.message)
                }        
                res.status(200).send(response)
            } catch (error) {
                res.status(500).send('500 - Internal Server Error')
            }
        } else {
            return res.status(400).send('400 - Bad Request')
        }
    },
    inviteOrganization: async function(req,res) {
        if (req.body.githubToken != null && req.body.email) {       
            try {
                const response = await getInviteOrganization(req)
                if(response.status != null){
                    return res.status(response.status).send(response.status + " " + response.message)
                }        
                res.status(200).send(response)
            } catch (error) {
                res.status(500).send('500 - Internal Server Error')
            }
        } else {
            return res.status(400).send('400 - Bad Request')
        }
    },
    inviteCollaboration: async function(req,res) {
        if (req.body.githubToken != null && req.params.repository != null && req.params.username) {       
            try {
                const response = await getInviteCollaboration(req)
                if(response.status == 204){
                    console.log(response.statusText)
                    return res.status(204).send(response.statusText)
                }        
                res.status(response.status).send(response.statusText+" - User has been invited")
            } catch (error) {
                console.log(error)
                res.status(500).send('500 - Internal Server Error')
            }
        }else{
            return res.status(400).send('400 - Bad Request')
        }
    },
    getTopics: async function(req,res){
        if (req.body.githubToken != null && req.params.repository != null) {       
            try {
                var response = await getRepositoryTopics(req.body.githubToken,req.params.repository)   
                if(response.status != null){
                    return res.status(response.status).send(response.status + " " + response.message)
                }     
                res.status(200).send(response)
            } catch (error) {
                res.status(500).send('500 - Internal Server Error')     
            }
        }else{
            return res.status(400).send('400 - Bad Request')
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
                //console.log(response)            
                res.status(200).send(response)
            } catch (error) {
                res.status(500).send('500 - Internal Server Error')         
            }
        }else{
            return res.status(400).send('400 - Bad Request')
        }
    },
    getRepositoriesIssues: async function(req, res) {
        if (req.body.githubToken != null && req.params.repository != null) {       
            var config = {
                method: 'get',
                url: 'https://api.github.com/repos/eagletrt/'+req.params.repository+'/issues',
                headers: { 
                    Accept: 'application/vnd.github.v3+json',
                    Authorization: `Bearer ${req.body.githubToken}`
                }
            };
            var response = []
            try {
                const issues = (await axios(config)).data
                for (let index = 0; index < issues.length; index++) {
                    response.push({"number" : issues[index].number, "title" : issues[index].title, "description" : issues[index].body})
                }
                res.status(200).send(response)
            } catch (error) {
                res.status(500).send('500 - Internal Server Error')                    
            }
        }else{
            return res.status(400).send('400 - Bad Request')
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
                res.status(200).send(response)
            } catch (error) {
                res.status(500).send('500 - Internal Server Error')                    
            }
        }else{
            return res.status(400).send('400 - Bad Request')
        }
    },
    assignGitHubIssue: async function(req, res) {
        if (req.body.githubToken != null && req.params.repository != null && req.params.issueID != null && req.body.username != null) {       
            try {
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
                const issue = await axios(config)
                var response = {
                    number: issue.data.number,                    
                    title: issue.data.title,                    
                    url: issue.data.url                    
                }
                res.status(200).send(response)
            } catch (error) {
                res.status(500).send('500 - Internal Server Error')                   
            }
        }else{
            return res.status(400).send('400 - Bad Request')
        }
    }

}