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
router.post('/tasks/:group', process_controller.createGroupTask)
router.post('/issues', process_controller.createIssue)

router.post('/problems', process_controller.createProblem)

router.get('/repositories/:userID', process_controller.getGroupsRepositories)

/*

auth
1 servizio
1 servizio

questi per ora sono quelli che riconosco far parte del process
gli altri casi da considerare sono quelli in cui la business si occupa
di fare più richieste ad un adapter. 

group repositories ad esempio deve:
	1 - prendere i token dello user
	2 - fare un richiesta per le repositories
	3 - fare una richiesta per i topics 
	4 - elaborare


*/


module.exports = router;