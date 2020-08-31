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
router.get('/test', function (req, res) {
    res.send('Hello from Github Service!');
});

router.get('/repositories/:token', github_controller.getRepositories)

router.get('/issues/:token', github_controller.getIssues)

module.exports = router;