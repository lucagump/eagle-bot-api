var express = require('express');
router = express.Router();

const database_controller = require('./controllers/database.controllers');

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
    res.send('Hello from Database Service!');
});

router.get('/token/:chatID', database_controller.getToken)

router.post('/token/', database_controller.storeToken)

router.delete('/token/:chatID', database_controller.deleteToken)


module.exports = router;