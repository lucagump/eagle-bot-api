const axios = require('axios')

const config = require('../../../config/config.json');
const { response } = require('express');
require('../models/github.models.js');						

// Documentation
// https://docs.github.com/en/rest/

async function getRepositoryTopics(githubToken, repository) {
    try {
        const response = await axios.get(`https://api.github.com/repos/eagletrt/`+repository+`/topics`, {
            headers: {
                'Accept': 'application/vnd.github.mercy-preview+json'
            },
            params: {
                'Authorization': githubToken
            }
        });
        repositoryTopics = response.data.names 
        return repositoryTopics
    } catch (error) {
        console.log(error)
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
        if(response.data == null){
            return "Cannot add User"
        }
        return "200 - Invitation Sent Correctly"
    } catch (error) {
        console.log(error)
        //handleError(error)
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
        console.log(error)
        //handleError(error)
    }  
}
// OK
async function getReposistoryNameFromOrganization(githubToken) {
    var response = []
    try {
        const repositories = (await axios.get(`https://api.github.com/orgs/eagletrt/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            params: {
                'Authorization': githubToken,
            }
        })).data
        for (let index = 0; index < repositories.length; index++) {
            response.push(repositories[index].name)
        }
        return response   
    } catch (error) {
        console.log(error)
        //handleError(error)
    }  
}

module.exports = {

    //Simple version, without validation or sanitation
    test: function(req, res) {
        res.send('Hello from Github Service!');
    },
    getRepositories: async function(req,res) {
        try {
            const response = await getReposistoryNameFromOrganization(req.body.githubToken)
            res.status(200).send(response)
        } catch (error) {
            res.status(500).send(error)
            console.log(error);            
        }
    },
    inviteOrganization: async function(req,res) {
        try {
            const response = await getInviteOrganization(req)
            res.status(200).send(response)
        } catch (error) {
            res.status(500).send(error)
            console.log(error);            
        }
    },
    inviteCollaboration: async function(req,res) {
        try {
            const response = await getInviteCollaboration(req)
            if(response.status == 204){
                response.data="204 - User is already a Collaborator"
            }
            res.status(response.status).send(response.data)
        } catch (error) {
            res.status(500).send(error)
            console.log(error);            
        }
    },
    getTopics: async function(req,res){
        try {
            var repositoryContainsTag = await getRepositoryTopics(req.body.githubToken,req.params.repository)   
            res.status(200).send(repositoryContainsTag)
        } catch (error) {
            res.status(500).send(error)
            console.log(error);            
        }
    },
    getRepositoriesByTopics: async function(req,res){
        var repositories = ['te','fe','ce','de']
        var repositoryContainsTag = ["volante","telemetria","chimera"]
        var topics = ["volante","telemetria","fenice"]
        //var topics = req.body.topics
        var repositoriesWithTopics = {}
        try {
            // var repositories = await getReposistoryNameFromOrganization(req.body.githubToken)
            // console.log(repositories)
            repositories.forEach(async function(element) {
                //var repositoryContainsTag = await getRepositoryTopics(req.body.githubToken,element)
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
            //console.log(response)            
            res.status(200).send(response)
        } catch (error) {
            res.status(500).send(error)
            console.log(error);            
        }
    },
    getRepositoriesIssues: async function(req, res) {
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
                response.push({"title" : issues[index].title, "description" : issues[index].body})
            }
            res.status(200).send(response)
        } catch (error) {
            res.status(500).send(error)
            console.log(error);            
        }
    },
    createGitHubIssue: async function(req, res) {

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
            const response = await axios(config)
            res.status(200).send(response.data)
        } catch (error) {
            res.status(500).send(error)
            console.log(error);            
        }
    },
    assignGitHubIssue: async function(req, res) {
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
            const response = await axios(config)
            res.status(200).send(response.data)
        } catch (error) {
            res.status(500).send(error)
            console.log(error);            
        }
    }

}