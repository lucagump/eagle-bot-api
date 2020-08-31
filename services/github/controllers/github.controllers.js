const axios = require('axios')
var GitHub = require('github-api');

const config = require('../../../config/config.json');
require('../models/github.models.js');						

function authenticateUser(githubToken,){
    var gh = new GitHub({
        token: githubToken
    });
    return gh
}

async function getIssues(githubToken) {
    try {
        const response = await axios.get(`https://api.github.com/orgs/eagletrt/issues`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            params: {
                'Authorization': githubToken,
                'filter': 'all',
                'state': 'open'
            }
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error)
        //handleError(error)
    }  
}

async function fetchRepoData(repoName) {
    try {
        const repo = await getRepoInfo(repoName);
        return repo.json();
    }
    catch (error) {
        console.log("Error found", e.message);
        throw error;
    }
}

async function getReposistoryFromOrganization(githubToken){
    var git = authenticateUser(githubToken)
    try {
        var response = [] 
        var organization = await git.getOrganization('eagletrt');
        var repositories = await organization.getRepos(); 
        for (let index = 0; index < repositories.length; index++) {
            response[index] = repositories[index].full_name;                
        }
        console.log(response)
        return await response;
    }
    catch (error) {
        console.log("Error found", error.message);
        throw error;
    }
}

module.exports = {

    //Simple version, without validation or sanitation
    test: function(req, res) {
        res.send('Greetings from the Test method!');
    },

    getIssues: function(req, res) {        
        // URL used to retrieve data dinamically
        let url = config.github.uri + "orgs/eagletrt/issues";
        const response = axios.get(url, { 
            headers: {
                'Authorization': req.params.token
            }
        })
        .then(function (response) {
            console.log(response.data);
            res.status(201).send(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            console.log("Every time you hit me")
        })
    },

    getUsers: function(req, res) {        
        // URL used to retrieve data dinamically
        let url = uri + "user";
        const response = axios.get(url, { 
            headers: {
                'Authorization': config.github.token
            }
        })
        .then(function (response) {
            console.log(response.data);
            res.status(201).send(response.data);
        })
        .catch(function (error) {
        console.log(error);
        })
        .then(function () {
            console.log("Every time you hit me")
        })
    },

    getRepositories: async function(req, res) {
        try {
            const data = await getIssues(req.params.token)
            console.log("data is"+data)
            res.status(200).send(data);
        } catch (error) {
            console.log(error);
            res.status(500).send('500 - Internal Server Error')
        }
    },

}