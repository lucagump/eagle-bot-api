const { assignTask } = require("../../actions/controllers/actions.controllers");

module.exports = {
    START: `Hey! I\'m here to help you manage your repositories issues and airtable tasks. Type /help to get started.`,
    SOMETHING_WENT_WRONG: `Something went wrong and I do not know how to handle this...`,
    REGISTER_SUCCESSFUL: `You have successfully been authenticated. Try me!.`,
    ACCOUNT_UNLINKED: `Your account has successfully been unlinked. You can register a new one via /authentication command now.`,
    UNAUTHORIZED: `Seems that your personal token is incorrect, /logout and then update your token via /authentication command if you want to continue using this bot.`,
    ABOUT: `Developer - Luca Martinelli aka lucagump. Check my website lucamartinelli.dev. Follow me on GitHub - https://github.com/lucagump. You can report issues directly to me and I'll respond as soon as possible, thanks.`,
    HELP: `Hi, I\'m here to show you something interesting about eagletrt profile. Although, you need to tell me your username and personal token for me to do that. Call me via \n\n /authentication airtableToken airtableBase githubToken usernameGitHub`,
};

commands = {
    eaglebot - call the menu bot
    authentication - authenticate to the server with your tokens
    members - get members list
    assignIssue - assign a repository issue to a member 
    assignTask - assign task to a member
    organization - invite to join organization
    collaboration - invite to join a project
    form - Airtable form
    problem - create a new issue and task
    newissue - create a new issue
    newtask - create a new task
    groups - get groups
    repositories - get repositories
    grouprepositories - get repositories divided in group
    getissues - get the issues of a repository

}