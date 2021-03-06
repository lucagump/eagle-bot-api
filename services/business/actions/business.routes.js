var express = require('express');
router = express.Router();

const business_controller = require('./controllers/business.controllers');

// __________             .__                             
// \______   \__ __  _____|__| ____   ____   ______ ______
//  |    |  _/  |  \/  ___/  |/    \_/ __ \ /  ___//  ___/
//  |    |   \  |  /\___ \|  |   |  \  ___/ \___ \ \___ \ 
//  |______  /____//____  >__|___|  /\___  >____  >____  >
//         \/           \/        \/     \/     \/     \/ 

/*
    GET		/repositories/:userID
            /topics/repositories
            /issues/:repository
            /tasks/groups/:groups/:userID
            /tasks/:userID
            /groups/members/:username
            /groups/members
    POST 	/issues/:issueID
            /issues
            /users/githubInvitation
            /tasks/:groups
            /tasks
            /problems
    PUT 	/tasks/:taskID
            /repositories/:repository/collaborators/:username
*/

router.get('/groups/members', business_controller.getMembers)
router.get('/groups/members/:username', business_controller.getMember)

router.post('/tasks', business_controller.createTask)
router.post('/tasks/:groups', business_controller.createGroupTask)
router.get('/tasks/:userID', business_controller.getTasks)
router.put('/tasks/:taskID', business_controller.assignTask)
router.get('/tasks/groups/:groups/:userID', business_controller.getGroupTasks)


router.post('/issues', business_controller.createIssue)
router.post('/issues/:issueID', business_controller.assignIssue)
router.get('/issues/:repository', business_controller.getIssues)


router.post('/problems', business_controller.createIssueTask)


router.get('/repositories/:userID', business_controller.getRepositories)
router.get('/topics/repositories', business_controller.getGroupsRepositories)

router.put('/repositories/:repository/collaborators/:username', business_controller.inviteCollaboration)
router.post('/users/githubInvitation', business_controller.inviteOrganization)


module.exports = router;