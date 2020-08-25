var Airtable = require('airtable');

const config = require('../../../config/config.json');

var base = new Airtable({apiKey: config.airtable.apikey}).base(config.airtable.base);

module.exports = {

    //Simple version, without validation or sanitation
    test: function(req, res) {
        res.send('Greetings from the Test method!');
    },

    getMembers: function(req, res) {
        base('Members').select({
            // Selecting the first 3 records in Full Grid:
            maxRecords: 10,
            view: "Full Grid"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
        
            records.forEach(function(record) {
                console.log('Retrieved', record.get('Name'));
            });
        
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();
        
        }, function done(err) {
            if (err) { 
                console.error(err); return; 
            } 
            res.status(201).send(records)
        });
    },

    getTasks: function(req, res) {
        base('Tasks').select({
            // Selecting the first 3 records in Full Grid:
            maxRecords: 10,
            view: "Full Grid"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
        
            records.forEach(function(record) {
                console.log('Retrieved', record.get('Name'));
            });

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();
        
        }, function done(err) {
            if (err) { 
                console.error(err); return; 
            } 
            res.status(201).send(records)
        });
    },

    createTask: function(req, res) {
        base('Tasks').create([
            {
              "fields": {
                "Task": req.title,
                "Group": [
                  req.group
                ],
                "Description": req.description,
                "Priority": req.priority,
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
}