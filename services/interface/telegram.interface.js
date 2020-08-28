var telegrambot = require('node-telegram-bot-api')
var schedule = require('node-schedule')
var express = require('express');
const axios = require('axios')

const config = require('../../config/config.json')
const telegram_controller = require('./controllers/telegram.controllers');
const { MESSAGES } = require('./common/messages.js')

router = express.Router();
var token = config.telegram.token;
var bot = new telegrambot(token, { polling: true })

// 
// .___        __                 _____                     
// |   | _____/  |_  ____________/ ____\____    ____  ____  
// |   |/    \   __\/ __ \_  __ \   __\\__  \ _/ ___\/ __ \ 
// |   |   |  \  | \  ___/|  | \/|  |   / __ \\  \__\  ___/ 
// |___|___|  /__|  \___  >__|   |__|  (____  /\___  >___  >
//          \/          \/                  \/     \/    \/ 
// 

bot.onText(/\/test/, function (msg) {
  bot.sendMessage(msg.chat.id, "Hello from Telegram Interface");
  bot.sendMessage(msg.chat.id, "Chat ID " + msg.chat.id);
  bot.sendMessage(msg.chat.id, "Group ID " + msg.from.id);
});

bot.onText(/\/start/, function (msg) {
  return bot.sendMessage(msg.from.id, MESSAGES.HELP);
});

bot.onText(/\/auth (.*):(.*)|\/auth/, function (msg, match) {
  const username = match[1] && match[1].split('@')[0];
  const token = match[2];
  const telegramId = msg.from.id;

  if (!username && !token) return bot.sendMessage(telegramId, MESSAGES.USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED);
  if (!username) return bot.sendMessage(telegramId, MESSAGES.USERNAME_NOT_SPECIFIED);
  if (!token) return bot.sendMessage(telegramId, MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);
  // DB REQUEST TO SEE IF repo user ARE AUTHORIZED
/*   User.findOne({ username, telegramId }, (error, user) => {
    if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

    if (!user) {
      User.create({ username, token, telegramId }, error => {
        if (error && error.code == '11000') return bot.sendMessage(telegramId, MESSAGES.USERNAME_ALREADY_REGISTERED);
        if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

        new GitHubNotification(username, token, new Date(0))
          .on('notification', notification => bot.sendMessage(telegramId, notification))
          .once('unauthorized', () => bot.sendMessage(telegramId, MESSAGES.UNAUTHORIZED));

        return bot.sendMessage(telegramId, MESSAGES.REGISTER_SUCCESSFUL);
      });
    } else {
      User.update({ username, telegramId }, { token }, error => {
        if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

        new GitHubNotification(username, token, user.notifiedSince)
          .on('notification', notification => bot.sendMessage(telegramId, notification))
          .once('unauthorized', () => bot.sendMessage(telegramId, MESSAGES.UNAUTHORIZED));

        return bot.sendMessage(telegramId, MESSAGES.PERSONAL_TOKEN_UPDATED);
      });
    }
  }); */
});

bot.onText(/\/logout/, function (msg) {
  const telegramId = msg.from.id;
/* FIND AND REMOVE ASK DB
  User.findOne({ telegramId }, (error, user) => {
    if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);
    if (!user) return bot.sendMessage(telegramId, MESSAGES.USER_NOT_EXISTS);

    User.remove({ telegramId }, error => {
      if (error) return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);

        return bot.sendMessage(telegramId, MESSAGES.ACCOUNT_UNLINKED);
    });
  });
*/
  return bot.sendMessage(msg.from.id, MESSAGES.ACCOUNT_UNLINKED);
});

bot.onText(/\/addIssue(.*):(.*)|\/addIssue/, function (msg, match) {
  const repo = match[1] && match[1].split('@')[0];
  const issue = match[2];
  const telegramId = msg.from.id;

  // Check valid message, check db airtable, create issue on github and airtable
  if (!repo && !token) return bot.sendMessage(telegramId, MESSAGES.USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED);
  if (!repo) return bot.sendMessage(telegramId, MESSAGES.USERNAME_NOT_SPECIFIED);
  if (!issue) return bot.sendMessage(telegramId, MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);

  return bot.sendMessage(msg.from.id, 'Issues created');
});

//bot.onText(/\/getIssues(.*):(.*)|\/getIssueS/, function (msg, match) {
//  const repo = match[1] && match[1].split('@')[0];
//  const issue = match[2];
//  const telegramId = msg.from.id;
//
//  // Check valid message, check github issues 
//  if (!repo && !token) return bot.sendMessage(telegramId, MESSAGES.USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED);
//  if (!repo) return bot.sendMessage(telegramId, MESSAGES.USERNAME_NOT_SPECIFIED);
//  if (!issue) return bot.sendMessage(telegramId, MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);
//
//  return bot.sendMessage(msg.from.id, 'Tiè Issues are here');
//});

bot.onText(/\/about/, function (msg) {
  return bot.sendMessage(msg.from.id, MESSAGES.ABOUT);
});
bot.onText(/\/help/, function (msg) {
  return bot.sendMessage(msg.from.id, response);
});

bot.onText(/\/getissues/, function (msg) {
  // var data  =  getIssuesTest();
  console.log(msg);
  return bot.sendMessage(msg.from.id, "data");
});

function getIssuesTest(req, res) {        
  // URL used to retrieve data dinamically
  let url = config.github.test
  const response = axios.get(url, { 
  })
  .then(function (response) {
    console.log(response.data);
    return response.data
  })
  .catch(function (error) {
    console.log("Every time you catch me")
    console.log(error);
  })
  .then(function () {
  })
};

let siteUrl;
bot.onText(/\/bookmark (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it, in which category?', {
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

bot.on("callback_query", (callbackQuery) => {
    const message = callbackQuery.message;

    bot.sendMessage(message.chat.id,'Added new Reporisotiry!');
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

// __________               __                 
// \______   \ ____  __ ___/  |_  ____   ______
//  |       _//  _ \|  |  \   __\/ __ \ /  ___/
//  |    |   (  <_> )  |  /|  | \  ___/ \___ \ 
//  |____|_  /\____/|____/ |__|  \___  >____  >
//         \/                        \/     \/ 
// 

router.get('/test', function (req, res) {
  res.send('Hello from the Telegram Route!');
});

router.get('/sendMessage/', telegram_controller.sendMessage)

module.exports = router;