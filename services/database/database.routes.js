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

router.get('/user/:chatID', database_controller.getUser)

router.post('/user/', database_controller.addUser)

router.post('/group/', database_controller.addGroup)

router.delete('/user/:chatID', database_controller.deleteToken)


module.exports = router;