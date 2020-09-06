var express = require('express');
router = express.Router();

const telegram_controller = require('./controllers/telegram.controllers');

/*
	GET		/test
	POST 	/send
*/

// a simple test url to check that the app is up and running
router.get('/test', function (req, res) {
    res.send('Hello from the Telegram Route!');
});

router.post('/send', telegram_controller.send)

module.exports = router;