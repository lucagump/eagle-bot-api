var express = require('express');
router = express.Router();

const database_controller = require('./controllers/database.controllers');

/*
	GET		/users
			/users/:userID
	POST 	/users
	PUT 	/users/userID
	DELETE	/users/:userID

*/

router.get('/users', database_controller.getUsers)
router.get('/users/:userID', database_controller.getUser)
router.post('/users', database_controller.addUser)
router.put('/users/:userID', database_controller.updateUser)
router.delete('/users/:userID', database_controller.deleteUser)

module.exports = router;