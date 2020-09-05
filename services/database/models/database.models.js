var mongoose = require('mongoose');

var User = new mongoose.Schema({
    userID: String,
    chatID: {type: String, required: true},
    usernameTelegram: String,
    usernameGitHub: {type: String, required: true},
    group: {type: String, required: true},
    githubToken: {type: String, required: true},
    airtableToken: {type: String, required: true},
    airtableBase: {type: String, required: true}
});

var Group = new mongoose.Schema({
    group: {type: String, required: true},
    chat: [String],
    repositories: [String]
});

// Export the model
mongoose.model('Users', User);
mongoose.model('Groups', Group);