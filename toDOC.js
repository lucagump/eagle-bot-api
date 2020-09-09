
DATABASE

// OK 
router.get('/users', database_controller.getUsers)
router.get('/users/:userID', database_controller.getUser)
router.post('/users', database_controller.addUser)
router.put('/users/:userID', database_controller.updateUser)
router.delete('/users/:userID', database_controller.deleteUser)

AIRTABLE

// OK
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

GITHUB

// OK
router.get('/repositories', github_controller.getRepositories)
router.get('/repositories/topics', github_controller.getRepositoriesByTopics)
router.get('/repositories/:repository/topics', github_controller.getTopics)
router.post('/repositories/:repository/issues/:issueID', github_controller.assignGitHubIssue)

router.get('/issues/:repository', github_controller.getRepositoriesIssues)
router.post('/issues/:repository', github_controller.createGitHubIssue)

router.put('/repositories/:repository/collaborators/:username', github_controller.inviteCollaboration)
router.post('/users/githubInvitation', github_controller.inviteOrganization)


ACTIONS


TELEGRAM

