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
    res.send('Hello World!');
    console.log("Tested")

});

router.get('/products/', database_controller.createProduct)

module.exports = router;