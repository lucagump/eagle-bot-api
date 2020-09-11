var Airtable = require('airtable');

module.exports = {
 
    getMembersForm: function (req,res){
        res.status(200).send('https://airtable.com/shrPh0AMVrQ8CHWpr')
    },    
    
    getMember: async function(req,res){
        if (req.body.airtableToken != null && req.body.airtableBase != null && req.params.username){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            
            try {
                const record = await base('Members')
                    .select({filterByFormula: "{Git Hub} = '" + req.params.username + "'"})
                    .firstPage();
                    
                    if(record[0] == null){
                        return res.status(404).send({
                            status: 'fail',
                            statusCode: 404,
                            errorMessage: 'Member couldn\'t be found, please try again later'
                        })
                    }
                    
                    var data = {
                        id: record[0].id,
                        name: record[0].fields.Collaborator.name,
                        tasks: record[0].fields.Tasks,
                        groups: record[0].fields.Group,
                    }
                    return res.status(200).send({
                        status: 'success',
                        statusCode: 200,
                        data: data
                    })
            } catch (err) {
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Member couldn\'t be deleted'
                })
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getMembers: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            var data = []
            try {
                const records = await base('Members')
                    .select()
                    .firstPage();
                
                if(records == null){
                    return res.status(404).send({
                        status: 'fail',
                        statusCode: 404,
                        errorMessage: 'Members couldn\'t be found, please try again later'
                    })
                }
                
                records.forEach(element => {
                    data.push({
                        id: element.id, 
                        name: element.fields.Collaborator.name,
                        groups: element.fields.Group,
                        tasks: element.fields.Tasks
                    }) 
                });

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: data
                })
            } catch (err) {
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Members couldn\'t be found'
                })
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getGroupsMembers: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            var data = []
            try {
                const records = await base('Members')
                    .select()
                    .firstPage();

                records.forEach(element => {
                    if(element.fields.Group.includes(req.params.group)){
                        data.push({
                            id: element.id, 
                            name: element.fields.Collaborator.name,
                            groups: element.fields.Group,
                            tasks: element.fields.Tasks
                        }) 
                    }
                });

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: data
                })
            } catch (err) {
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Groups Members couldn\'t be found'
                })
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    
    getTask: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null && req.params.taskID != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            
            try {
                const task = await base('Tasks').find(req.params.taskID)

                task.fields.id = task.id
                data = task.fields
                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: data
                })
            } catch (err) {
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Task couldn\'t be found'
                })
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getTasks: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            var data = []
            
            try {
                const records = await base('Tasks').select().firstPage();

                records.forEach(element => {
                    data.push(element.fields.Task) 
                });

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: data
                })
            } catch (err) {
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Tasks couldn\'t be found'
                })
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    getGroupTasks: async function(req,res){
        if (req.body.airtableToken != null && req.body.airtableBase != null && req.params.group != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            try {
                var records = await base('Tasks').select().firstPage();
                   
                var data = []
                records.forEach(element => {
                    if(element.fields.Group != null) {
                        if(element.fields.Group.includes(req.params.group)){
                            data.push({
                                id: element.id,
                                task: element.fields.Task, 
                                description: element.fields.Description
                            }) 
                        }
                    }
                });

                return res.status(200).send({
                    status: 'success',
                    statusCode: 200,
                    data: data
                })
            } catch (err) {
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Group tasks couldn\'t be found'
                })
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },

    createAirTableTask: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null && req.body.title != null){
            
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            
            var members = await base('Members')
                .select()
                .firstPage();
            
            var membersInfos = []
            
            members.forEach(element => {
                membersInfos.push({
                    id: element.id, 
                    name: element.fields.Collaborator.name,
                    groups: element.fields.Group,
                    tasks: element.fields.Tasks
                }) 
            });
            var minTask = membersInfos[0];      

            for (i = 0; i < membersInfos.length; i++){
                if (minTask.tasks.length > (membersInfos[i].tasks).length) {
                    minTask = membersInfos[i];
                }
            }
            try {
                const newTask = await base('Tasks').create({
                        "Task": req.body.title,
                        "Description": req.body.description,
                        "Status": "🧪In Box🔨",
                        "AssignTo": [minTask.id]
                    });
                newTask.fields.id = newTask.id

                data = newTask.fields
                
                return res.status(201).send({
                    status: 'success',
                    statusCode: 201,
                    data: data
                })
            } catch (err) {
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Task couldn\'t be created'
                })
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    createAirTableTaskGroup: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null && req.body.title != null && req.params.group != null ){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            try {
                var members = await base('Members')
                    .select()
                    .firstPage();

                var membersInfos = []    
                members.forEach(element => {
                    if(element.fields.Group.includes(req.params.group)){
                        membersInfos.push({
                            id: element.id, 
                            name: element.fields.Collaborator.name,
                            groups: element.fields.Group,
                            tasks: element.fields.Tasks
                        })
                    } 
                });
                if(membersInfos[0] == null){
                    res.status(400).send("400 - Bad Request")
                }
                var minTask = membersInfos[0];      
            
                for (i = 0; i < membersInfos.length; i++){
                    if (minTask.tasks.length > (membersInfos[i].tasks).length) {
                        minTask = membersInfos[i];
                    }
                }
                const newTask = await base('Tasks').create({
                        "Task": req.body.title,
                        "Group": [
                            req.params.group
                        ],
                        "Description": req.body.description,
                        "Status": "🧪In Box🔨",
                        "AssignTo": [minTask.id]
                    });
                    newTask.fields.id = newTask.id
                    data = newTask.fields

                    return res.status(201).send({
                        status: 'success',
                        statusCode: 201,
                        data: data
                    })
            } catch (err) {
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Task couldn\'t be created'
                })
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    },
    
    assignTask: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null && req.params.taskID && req.body.username != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            try {
                var members = await base('Members')
                .select({filterByFormula: "{Git Hub} = '" + req.body.username + "'"})
                .firstPage();
                
                var member = {
                    id: members[0].id,
                    name: members[0].fields.Collaborator.name,
                    tasks: members[0].fields.Tasks,
                    groups: members[0].fields.Group,
                }
                var task = await base('Tasks').find(req.params.taskID)
                if(!((task.fields.AssignTo).includes(member.id))){
                    task.fields.AssignTo.push(member.id)
                }
                var taskDeleted = await base('Tasks').destroy(req.params.taskID)
                var taskUpdated = await base('Tasks').create({
                    "Task": task.fields.Task,
                    "Description": task.fields.Description,
                    "Status": task.fields.Status,
                    "Group": task.fields.Group,
                    "AssignTo": task.fields.AssignTo
                });
                taskUpdated.fields.id = taskUpdated.id
                data = taskUpdated.fields

                return res.status(201).send({
                    status: 'success',
                    statusCode: 201,
                    data: data
                })
            } catch (err) {
                console.log(err)
                return res.status(500).send({
                    status: 'fail',
                    statusCode: 500,
                    errorMessage: 'Task couldn\'t be assigned'
                })
            }
        } else {
            return res.status(400).send({
                status: 'fail',
                statusCode: 400,
                data: 'Bad Request'
            })
        }
    }
}