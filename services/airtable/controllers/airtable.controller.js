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

    getMembers: async function(req, res) {
        
        var text = '{ "employees" : [' +
        '{ "firstName":"John" , "lastName":"Doe" },' +
        '{ "firstName":"Anna" , "lastName":"Smith" },' +
        '{ "firstName":"Peter" , "lastName":"Jones" } ]}';

        var members = await getMembers();
        var tasks = await getTasks();

        // console.log(JSON.stringify(records));
        // res.status(201).send(JSON.parse(text))
        res.status(201).send(members)
    },

    getTasks: async function(req, res) {
        
        var text = '{ "employees" : [' +
        '{ "firstName":"John" , "lastName":"Doe" },' +
        '{ "firstName":"Anna" , "lastName":"Smith" },' +
        '{ "firstName":"Peter" , "lastName":"Jones" } ]}';

        var members = await getMembers();
        var tasks = await getTasks();

        // console.log(JSON.stringify(records));
        // res.status(201).send(JSON.parse(text))
        res.status(201).send(data)
    },

    createTask: function(req, res) {
        if (req.body.airtableToken != null && req.body.airtableBase != null)

        var base = authenticateUser(airtableToken,airtableBase)
        base('Tasks').create([
            {
              "fields": {
                "Task": req.body.title,
                "Group": [
                  req.body.group
                ],
                "Description": req.body.description,
                "Priority": "",
                "Status": "",
                "Assign To": [
                  ""
                ]
              }
            }
          ], function(err, records) {
            if (err) {
              console.error(err);
              return;
            }
            records.forEach(function (record) {
                console.log(record.getId());
                res.status(201).send(records)
            });
          });
    },

    deleteTask: function(req, res) {
        base('Members').destroy([ req.recordID,], function(err, deletedRecords) {
            if (err) {
              console.error(err);
              return;
            }
            console.log('Deleted', deletedRecords.length, 'records');
          });
    },

    assignTask: function(req, res) {
        // Check se esiste la task
        base('Members').update([
        {
            "id": req.recordID,
            "Tasks": [
                req.taskID
            ],
        }
        ], function(err, records) {
            if (err) {
                console.error(err);
                return;
            }
            records.forEach(function(record) {
                console.log(record.get('Department'));
            });
        });
    }
}