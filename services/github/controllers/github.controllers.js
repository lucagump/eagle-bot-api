const axios = require('axios')

const config = require('../../../config/config.json');
const { response } = require('express');
require('../models/github.models.js');						

// Documentation
// https://docs.github.com/en/rest/


function checkRepositoryTopics(repository,topics,repositoryTopics){
    
    // for (let i = 0; i < repositoryContainsTag.length; i++) {
    //     response.push('{'+ repositories[index]+':'+ topics[i] +'}')
    // }
    
    if(repositoryTopics != null){
        console.log(repository + " " + repositoryTopics)
        
        for (let index = 0; index < topics.length; index++) {
            console.log("topics[index] to check "+topics[index])
            if (repositoryTopics.includes(topics[index])){
                toReturn.push(topics[index])
            } 
        }

        for (let index = 0; index < topics.length; index++) {
            if(topicIsContained[index] == true) {
                repoToReturn.topics[index] = 0;
            }
        }
        return toReturn
    } else {
        toReturn = null
        return toReturn
    }
}
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
        var topics = req.body.topics
        try {
            var repositories = await getReposistoryNameFromOrganization(req.body.githubToken)
            //var repositories = ['te','fe','ce','de']
            
            
            for (let index = 0; index < repositories.length; index++) {
                var repositoryContainsTag = await getRepositoryTopics(req.body.githubToken,repositories[index])   
                var string = '{ "repository" : "' + repositories[index] + '", "topics" : "' + repositoryContainsTag + '"}'      
                repositoriesTags.push(string)
            }
            // questa funzione lavora su una singola repo, va scritta per farle entambe
            //response = checkRepositoryTopics(repositories,topics,repositoryTopics)
            
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
        
        try {
            const response = await axios(config)
            res.status(200).send(response.data)
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
    }
}