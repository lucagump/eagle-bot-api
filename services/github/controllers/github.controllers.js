const axios = require('axios')
var GitHub = require('github-api');

const config = require('../../../config/config.json');
require('../models/github.models.js');						

const uri = config.github.uri;

function getAllRepos() {
    return axios.get('https://api.github.com/users/lucagump/repos');
}

function getRepoInfo(repoName) {
    return axios.get(`https://api.github.com/repos/lucagump/${repoName}`);
}

async function fetchAllRepos() {
    try {
        const response = await getAllRepos();
        return response.json();
    }
    catch (error) {
        console.log("Error found", error.message);
        throw error;
    }
}

async function fetchRepoData(repoName) {
    try {
        const repo = await getRepoInfo(repoName);
        return repo.json();
    }
    catch (e) {
        console.log("Error found", e.message);
        throw e;
    }
}

async function test(req){
    // basic auth
    var gh = new GitHub({
        token: req.body.githubToken
    });
    
    var me = gh.getUser();
    me.listNotifications(function(err, notifications) {
        console.log(notifications)
    });
    var lucagump = gh.getUser('lucagump');
    lucagump.listStarredRepos(function(err, repos) {
        console.log(repos)
    });

    try {
        const response = await axios.get(app_domain + "/database/token/" + req.params.chatID)
        return response.data
    } catch (error) {
        handleError(error)
    }  
}

module.exports = {

    //Simple version, without validation or sanitation
    test: function(req, res) {
        res.send('Greetings from the Test method!');
    },

    getIssues: function(req, res) {        
        // URL used to retrieve data dinamically
        let url = uri + "orgs/eagletrt/issues";
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
    getRepositories: function(req, res) {
    
    },
}