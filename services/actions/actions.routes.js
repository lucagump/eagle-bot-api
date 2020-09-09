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

router.post('/users', actions_controller.addUserToDataBase)
router.get('/users/:userID', actions_controller.getUserFromDataBase)
router.delete('/users/:userID', actions_controller.deleteUserFromDataBase)


router.get('/groups/members', actions_controller.getMembers)
router.get('/groups/members/:username', actions_controller.getMember)

router.post('/tasks', actions_controller.createTask)
router.post('/tasks/:group', actions_controller.createGroupTask)
router.get('/tasks/:userID', actions_controller.getTasks)
router.put('/tasks/:taskID', actions_controller.assignTask)
router.get('/tasks/groups/:group/:userID', actions_controller.getGroupTasks)


router.post('/issues', actions_controller.createIssue)
router.post('/issues/:issueID', actions_controller.assignIssue)
router.get('/issues/:repository', actions_controller.getIssues)


router.post('/problems', actions_controller.createIssueTask)


router.get('/repositories/:userID', actions_controller.getRepositories)
router.get('/topics/repositories/:userID', actions_controller.getGroupsRepositories)

router.put('/repositories/:repository/collaborators/:username', actions_controller.inviteCollaboration)
router.post('/users/githubInvitation', actions_controller.inviteOrganization)


module.exports = router;