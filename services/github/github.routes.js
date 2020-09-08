var express = require('express');
router = express.Router();

const github_controller = require('./controllers/github.controllers');

/*
	GET		/user
			/user/BTC
			/user/ETH
			/user/USD
	POST 	/user
	PUT 	/user/balance
	DELETE	/plannedaction/:id
*/

// a simple test url to check that our app is up and running
router.get('/test', github_controller.test);

router.get('/repositories', github_controller.getRepositories)
router.get('/repositories/topics', github_controller.getRepositoriesByTopics)
router.get('/repositories/:repository/topics', github_controller.getTopics)
router.post('/repositories/:repository/issues/:issueID', github_controller.assignGitHubIssue)

router.get('/issues/:repository', github_controller.getRepositoriesIssues)
router.post('/issues/:repository', github_controller.createGitHubIssue)

router.put('/repositories/:repository/collaborators/:username', github_controller.inviteCollaboration)
router.post('/users/githubInvitation', github_controller.inviteOrganization)

module.exports = router;