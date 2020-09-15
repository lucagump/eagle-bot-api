var express = require('express');
router = express.Router();

const process_controller = require('./controllers/process.controllers');

// __________                                           
// \______   \_______  ____   ____  ____   ______ ______
//  |     ___/\_  __ \/  _ \_/ ___\/ __ \ /  ___//  ___/
//  |    |     |  | \(  <_> )  \__\  ___/ \___ \ \___ \ 
//  |____|     |__|   \____/ \___  >___  >____  >____  >
//                               \/    \/     \/     \/ 


router.post('/login', process_controller.authenticateUser)
router.get('/users/:userID', process_controller.getUser)
router.delete('/logout/:userID', process_controller.logout)

router.post('/tasks', process_controller.createTask)
router.post('/tasks/:groups', process_controller.createGroupTask)
router.post('/issues', process_controller.createIssue)

router.post('/problems', process_controller.createProblem)

router.get('/repositories/:userID', process_controller.getGroupsRepositories)


module.exports = router;