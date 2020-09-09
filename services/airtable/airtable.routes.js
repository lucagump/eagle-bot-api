var express = require('express');
router = express.Router();

const airtable_controller = require('./controllers/airtable.controller');

/*
	GET		/user
			/user/BTC
			/user/ETH
			/user/USD
	POST 	/user
	PUT 	/user/balance
	DELETE	/plannedaction/:id
*/

router.get('/form', airtable_controller.getMembersForm)

router.get('/members', airtable_controller.getMembers)
router.get('/members/:username', airtable_controller.getMember)
router.get('/groups/:group', airtable_controller.getGroupsMembers)

router.get('/tasks/:taskID', airtable_controller.getTask)
router.get('/tasks', airtable_controller.getTasks)
router.get('/tasks/groups/:group', airtable_controller.getGroupTasks)
router.post('/tasks', airtable_controller.createAirTableTask)
router.post('/tasks/:group', airtable_controller.createAirTableTaskGroup)
router.put('/tasks/:taskID', airtable_controller.assignTask)

module.exports = router;