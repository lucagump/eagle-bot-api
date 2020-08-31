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

router.get('/sendMessage', actions_controller.sendMessage)

router.get('/token/:chatID', actions_controller.getTokens)

router.delete('/token/:chatID', actions_controller.deleteTokens)

router.get('/repositories/:chatID', actions_controller.getRepositories)

router.get('/issues/:chatID', actions_controller.getIssues)

router.post('/issue', actions_controller.createIssue)

router.post('/token', actions_controller.storeTokens)

router.get('/postman', actions_controller.postman)

module.exports = router;