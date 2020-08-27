var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    token: String,
    repositories: String,
});

// Export the model
mongoose.model('github_users', UserSchema);