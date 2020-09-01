var express = require('express');
router = express.Router();

const database_controller = require('./controllers/database.controllers');

/*
	GET		/users
			/users/:chatID
			/groups/
			/groups/:group
	POST 	/users
	 		/groups
	DELETE	/users/:chatID
			/groups/:group

*/

// a simple test url to check that our app is up and running
router.get('/test', function (req, res) {
    res.send('Hello from Database Service!');
});

// da testare
router.get('/users/', database_controller.getUsers)
router.get('/users/:chatID', database_controller.getUser)
router.post('/users/', database_controller.addUser)
router.delete('/users/:chatID', database_controller.deleteUser)

// da testare
router.get('/groups', database_controller.getGroups)
router.get('/groups/:group', database_controller.getGroup)
router.post('/groups', database_controller.addGroup)
router.delete('/groups/:group', database_controller.deleteGroup)



module.exports = router;