var Airtable = require('airtable');

const config = require('../../../config/config.json');

function authenticateUser(airTableToken,airTableBase){
    var base = new Airtable({apiKey: airTableToken}).base(airTableBase);  
    return base
}

async function getMembers(){ 
    base('Members').select({
        view: "Full Grid",
        cellFormat: "json",
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
        records.forEach(function(record) {
            console.log(record.get('Name') + " Tasks Assigned "+ record.get('Tasks'));
        });
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    
    }, function done(err) {
        if (err) { 
            console.error(err); return; 
        } else {
            return records;
        }
    });
};

async function getTasks() {
    base('Tasks').select({
        view: "Full Grid",
        cellFormat: "json",
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
        records.forEach(function(record) {
            console.log('Retrieved', record.get('Assign To'));
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    
    }, function done(err) {
        if (err) { 
            console.error(err); return; 
        } else {
            return records;
        }
    });    
};

async function findRecord(table, recordID){
    base(table).find(recordID, function(err, record) {
        if (err) { console.error(err); return; }
        console.log('Retrieved', record.id);
    })
}

module.exports = {

    //Simple version, without validation or sanitation
    test: function(req, res) {
        res.send('Greetings from the Test method!');
    },
    
    getMembersForm: function (req,res){
        res.status(200).send('https://airtable.com/shrPh0AMVrQ8CHWpr')
    },
    getMembers: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            var response = []
            try {
                const records = await base('Members')
                    .select()
                    .firstPage();

                records.forEach(element => {
                    console.log(element)
                    response.push({
                        id: element.id, 
                        name: element.fields.Collaborator.name,
                        groups: element.fields.Group,
                        tasks: element.fields.Tasks
                    }) 
                });

                res.status(201).send(response)
            } catch (err) {
                console.error(err);
                return res.status(500).send("500 - Internal Server Error");
            }
        } else {
            res.status(400).send("400 - Bad Request")
        }
    },
    getGroupsMembers: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            var response = []
            try {
                const records = await base('Members')
                    .select()
                    .firstPage();

                records.forEach(element => {
                    if(element.fields.Group.includes(req.params.group)){
                        response.push({
                            id: element.id, 
                            name: element.fields.Collaborator.name,
                            groups: element.fields.Group,
                            tasks: element.fields.Tasks
                        }) 
                    }
                });

                res.status(201).send(response)
            } catch (err) {
                console.error(err);
                return res.status(500).send("500 - Internal Server Error");
            }
        } else {
            res.status(400).send("400 - Bad Request")
        }
    },
    getMember: async function(req,res){
        console.log(req.body.airtableToken+" "+req.body.airtableBase)
        if (req.body.airtableToken != null && req.body.airtableBase != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            
            try {
                const record = await base('Members')
                    .select({filterByFormula: "{Git Hub} = '" + req.params.username + "'"})
                    .firstPage();
                    var response = {
                        id: record[0].id,
                        name: record[0].fields.Collaborator.name,
                        tasks: record[0].fields.Tasks,
                        groups: record[0].fields.Group,
                    }
                res.status(201).send(response)
            } catch (err) {
                console.error(err);
                return res.status(500).send("500 - Internal Server Error");
            }
        } else {
            res.status(400).send("400 - Bad Request")
        }
    },
    getTask: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null && req.params.taskID != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            var response = []
            try {
                const task = await base('Tasks').find(req.params.taskID)
                res.status(200).send(task)
            } catch (err) {
                console.error(err);
                return res.status(err.statusCode).send(err);
            }
        } else {
            res.status(400).send("400 - Bad Request")
        }
    },
    getTasks: async function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            var response = []
            try {
                const records = await base('Tasks')
                    .select()
                    .firstPage();

                records.forEach(element => {
                    response.push(element.fields.Task) 
                });

                res.status(201).send(response)
            } catch (err) {
                console.error(err);
                return res.status(500).send("500 - Internal Server Error");
            }
        } else {
            res.status(400).send("400 - Bad Request")
        }
    },
    getGroupTasks: async function(req,res){
        console.log(req.body)
        if (req.body.airtableToken && req.body.airtableBase){
            var base = new Airtable({ 'apiKey': req.body.airtableToken }).base(req.body.airtableBase); 
            var response = []
            try {
                var records = await base('Tasks')
                    .select(/*{filterByFormula: "{Group} = '" + req.params.group + "'"}*/)
                    .firstPage();
                console.log(records)
                records.forEach(element => {
                    if(element.fields.Group.includes(req.params.group)){
                        response.push({task: element.fields.Task, description: element.fields.Description}) 
                    }
                });

                res.status(201).send(response)
            } catch (err) {
                console.error(err);
                return res.status(500).send("500 - Internal Server Error");
            }
        } else {
            res.status(400).send("400 - Bad Request: " + req.body.airtableBase+" and "+req.body.airtableToken)
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
                res.status(201).send(newTask)
            } catch (err) {
                console.error(err);
                return res.status(500).send("500 - Internal Server Error");
            }
        } else {
            res.status(400).send("400 - Bad Request")
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
                var minTask = membersInfos[0];      
            
                for (i = 0; i < membersInfos.length; i++){
                    if (minTask.tasks.length > (membersInfos[i].tasks).length) {
                        minTask = membersInfos[i];
                        console.log(minTask)
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
                res.status(201).send(newTask)
            } catch (err) {
                console.error(err);
                return res.status(500).send("500 - Internal Server Error");
            }
        } else {
            res.status(400).send("400 - Bad Request")
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
                res.status(201).send(taskUpdated)
            } catch (err) {
                console.error(err);
                return res.status(err.statusCode).send(err);
            }
        } else {
            console.log("something")
            res.status(400).send("400 - Bad Request")
        }
    }
}