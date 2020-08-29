var schedule = require('node-schedule')
const axios = require('axios')
const moment = require('moment')

const telegrambot = require('./common/telegram.instance')
const config = require('../../config/config.json')
const { MESSAGES } = require('./common/messages.js')

const startTime = moment();

// 
// .___        __                 _____                     
// |   | _____/  |_  ____________/ ____\____    ____  ____  
// |   |/    \   __\/ __ \_  __ \   __\\__  \ _/ ___\/ __ \ 
// |   |   |  \  | \  ___/|  | \/|  |   / __ \\  \__\  ___/ 
// |___|___|  /__|  \___  >__|   |__|  (____  /\___  >___  >
//          \/          \/                  \/     \/    \/ 
// 

telegrambot.onText(/\/test/, function (msg) {
  console.log(msg);
  telegrambot.sendMessage(msg.chat.id, 
    "Hello "+ msg.from.username + "\n"+
    "our Chat ID is: " + msg.chat.id + 
    "\nyour Group ID is: " + msg.from.id);
});

telegrambot.onText(/\/uptime/, message => {
  const fromId = message.from.id;
  const response = "Uptime: "+ startTime.from(moment(), true);
  console.log(fromId)
  telegrambot.sendMessage(fromId, response);
});

telegrambot.onText(/\/start/, function (msg) {
  telegrambot.sendMessage(msg.from.id, MESSAGES.HELP);
});

telegrambot.onText(/\/auth (.*):(.*)|\/auth/, function (msg, match) {
  const username = match[1] && match[1].split('@')[0];
  const token = match[2];
  const telegramId = msg.from.id;

  if (!username && !token) return telegrambot.sendMessage(telegramId, MESSAGES.USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED);
  if (!username) return telegrambot.sendMessage(telegramId, MESSAGES.USERNAME_NOT_SPECIFIED);
  if (!token) return telegrambot.sendMessage(telegramId, MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);
  // DB REQUEST TO SEE IF repo user ARE AUTHORIZED
/*   User.findOne({ username, telegramId }, (error, user) => {
    if (error) return telegrambot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

    if (!user) {
      User.create({ username, token, telegramId }, error => {
        if (error && error.code == '11000') return telegrambot.sendMessage(telegramId, MESSAGES.USERNAME_ALREADY_REGISTERED);
        if (error) return telegrambot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

        new GitHubNotification(username, token, new Date(0))
          .on('notification', notification => telegrambot.sendMessage(telegramId, notification))
          .once('unauthorized', () => telegrambot.sendMessage(telegramId, MESSAGES.UNAUTHORIZED));

        return telegrambot.sendMessage(telegramId, MESSAGES.REGISTER_SUCCESSFUL);
      });
    } else {
      User.update({ username, telegramId }, { token }, error => {
        if (error) return telegrambot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

        new GitHubNotification(username, token, user.notifiedSince)
          .on('notification', notification => telegrambot.sendMessage(telegramId, notification))
          .once('unauthorized', () => telegrambot.sendMessage(telegramId, MESSAGES.UNAUTHORIZED));

        return telegrambot.sendMessage(telegramId, MESSAGES.PERSONAL_TOKEN_UPDATED);
      });
    }
  }); */
});

telegrambot.onText(/\/logout/, function (msg) {
  const telegramId = msg.from.id;
/* FIND AND REMOVE ASK DB
  User.findOne({ telegramId }, (error, user) => {
    if (error) return telegrambot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);
    if (!user) return telegrambot.sendMessage(telegramId, MESSAGES.USER_NOT_EXISTS);

    User.remove({ telegramId }, error => {
      if (error) return telegrambot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

        return telegrambot.sendMessage(telegramId, MESSAGES.ACCOUNT_UNLINKED);
    });
  });
*/
  return telegrambot.sendMessage(msg.from.id, MESSAGES.ACCOUNT_UNLINKED);
});

telegrambot.onText(/\/addIssue(.*):(.*)|\/addIssue/, function (msg, match) {
  const repo = match[1] && match[1].split('@')[0];
  const issue = match[2];
  const telegramId = msg.from.id;

  // Check valid message, check db airtable, create issue on github and airtable
  if (!repo && !token) return telegrambot.sendMessage(telegramId, MESSAGES.USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED);
  if (!repo) return telegrambot.sendMessage(telegramId, MESSAGES.USERNAME_NOT_SPECIFIED);
  if (!issue) return telegrambot.sendMessage(telegramId, MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);

  return telegrambot.sendMessage(msg.from.id, 'Issues created');
});

//telegrambot.onText(/\/getIssues(.*):(.*)|\/getIssueS/, function (msg, match) {
//  const repo = match[1] && match[1].split('@')[0];
//  const issue = match[2];
//  const telegramId = msg.from.id;
//
//  // Check valid message, check github issues 
//  if (!repo && !token) return telegrambot.sendMessage(telegramId, MESSAGES.USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED);
//  if (!repo) return telegrambot.sendMessage(telegramId, MESSAGES.USERNAME_NOT_SPECIFIED);
//  if (!issue) return telegrambot.sendMessage(telegramId, MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);
//
//  return telegrambot.sendMessage(msg.from.id, 'Tiè Issues are here');
//});

telegrambot.onText(/\/about/, function (msg) {
  return telegrambot.sendMessage(msg.from.id, MESSAGES.ABOUT);
});
telegrambot.onText(/\/help/, function (msg) {
  return telegrambot.sendMessage(msg.from.id, response);
});

telegrambot.onText(/\/getissues/, async function (msg) {
  const data  = await getIssuesTest();
  console.log(msg);
  await telegrambot.sendMessage(msg.from.id, data.page)
});

async function getIssuesTest() {        
  // URL used to retrieve data dinamically
  let url = config.github.test
  try {
    const response = await axios.get(url)
    console.log(response.data);
    return response.data
  } 
  catch(error) {
    console.log("Every time you catch me")
    console.log(error);
  }
};

let siteUrl;
telegrambot.onText(/\/bookmark (.+)/, (msg, match) => {
  siteUrl = match[1];
  telegrambot.sendMessage(msg.chat.id,'Got it, in which category?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Telemetria',
          callback_data: 'development'
        },{
          text: 'Volante',
          callback_data: 'music'
        },{
          text: 'Exporter',
          callback_data: 'cute-monkeys'
        }
      ]]
    }
  });
});

telegrambot.on("callback_query", (callbackQuery) => {
    const message = callbackQuery.message;

    telegrambot.sendMessage(message.chat.id,'Added new Reporisotiry!');
});

var scheduledMessage = schedule.scheduleJob('30 18 * * *', function () {});

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL).

// a simple test url to check that our app is up and running
