var express = require('express');
router = express.Router();

const actions_controller = require('./controllers/actions.controllers');

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
router.get('/test', function (req, res) {
    res.send('Hello from the Business Logic!');
});

// da testare
router.get('/users/:userID', actions_controller.getUserFromDataBase)
router.post('/users', actions_controller.addUserToDataBase)
router.delete('/users/:userID', actions_controller.deleteUserFromDataBase)

router.get('/issues/:chatID', actions_controller.getIssues)
router.post('/issues', actions_controller.createIssue)

router.post('/group/:group', actions_controller.addGroup)

router.put('/repositories/:repository/collaborators/:username', actions_controller.inviteCollaboration)
router.post('/users/githubInvitation', actions_controller.inviteOrganization)

router.get('/repositories/:chatID', actions_controller.getRepositories)
router.get('/sendMessage', actions_controller.sendMessage)

module.exports = router;