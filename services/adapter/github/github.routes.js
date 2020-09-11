var express = require('express');
router = express.Router();

const github_controller = require('./controllers/github.controllers');

//    _____       .___              __                
//   /  _  \    __| _/____  _______/  |_  ___________ 
//  /  /_\  \  / __ |\__  \ \____ \   __\/ __ \_  __ \
// /    |    \/ /_/ | / __ \|  |_> >  | \  ___/|  | \/
// \____|__  /\____ |(____  /   __/|__|  \___  >__|   
//         \/      \/     \/|__|             \/       

/*
	GET		/repositories
			/repositories/topics
			/repositories/:repository/topics
			/user/USD
	POST 	/repositories/:repository/issues/:issueID
			/issues/:repository
			/users/githubInvitation
	PUT 	/repositories/:repository/collaborators/:username
*/

router.get('/repositories', github_controller.getRepositories)
router.get('/repositories/topics', github_controller.getRepositoriesByTopics)
router.get('/repositories/:repository/topics', github_controller.getRepositoryTopics)
router.post('/repositories/:repository/issues/:issueID', github_controller.assignGitHubIssue)

router.get('/issues/:repository', github_controller.getRepositoryIssues)
router.post('/issues/:repository', github_controller.createGitHubIssue)

router.put('/repositories/:repository/collaborators/:username', github_controller.inviteCollaboration)
router.post('/users/githubInvitation', github_controller.inviteOrganization)

module.exports = router;