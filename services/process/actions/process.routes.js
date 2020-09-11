var express = require('express');
router = express.Router();

const actions_controller = require('./controllers/actions.controllers');

// __________                                           
// \______   \_______  ____   ____  ____   ______ ______
//  |     ___/\_  __ \/  _ \_/ ___\/ __ \ /  ___//  ___/
//  |    |     |  | \(  <_> )  \__\  ___/ \___ \ \___ \ 
//  |____|     |__|   \____/ \___  >___  >____  >____  >
//                               \/    \/     \/     \/ 


router.post('/users', actions_controller.addUserToDataBase)
router.delete('/users/:userID', actions_controller.deleteUserFromDataBase)

router.put('/tasks/:taskID', actions_controller.assignTask)

router.post('/problems', actions_controller.createIssueTask)

router.get('/topics/repositories/:userID', actions_controller.getGroupsRepositories)

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