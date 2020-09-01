var schedule = require('node-schedule')
const axios = require('axios')
const moment = require('moment')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const config = require('../../config/config.json')
const MESSAGES = require('./common/messages.js')

const startTime = moment();

const token = process.env.TELEGRAM_TOKEN;

console.log(token)
const telegrambot = new Telegraf(token)

telegrambot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const response_time = new Date() - start
  console.log(`(Response Time: ${response_time})`)
})

telegrambot.launch()

async function authentication(msg,airtableToken,githubToken,usernameGitHub,group){
  try {
    const response = await axios.post(app_domain + '/actions/token',{
      userID: msg.from.id,
      chatID: msg.chat.id,
      usernameTelegram: msg.from.username,
      usernameGitHub: usernameGitHub,
      group: group,
      githubToken: githubToken,
      airtableToken: airtableToken
    });
    return response.data
  } catch (error) {
      var errorMessage = "Something bad just happened! Check your Server " + error.status
      console.log(error)
      return errorMessage
  }
}

async function logout(msg){
  try {
    const response = await axios.delete(app_domain + '/actions/token/' + msg.chat.id);
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

async function getRepositories(msg){
  try {
    const response = await axios.get(app_domain + '/actions/repositories/' + msg.chat.id);
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

async function getIssues(msg){
  try {
    const response = await axios.get(app_domain + '/actions/issues/' + msg.chat.id);
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

// 
// .___        __                 _____                     
// |   | _____/  |_  ____________/ ____\____    ____  ____  
// |   |/    \   __\/ __ \_  __ \   __\\__  \ _/ ___\/ __ \ 
// |   |   |  \  | \  ___/|  | \/|  |   / __ \\  \__\  ___/ 
// |___|___|  /__|  \___  >__|   |__|  (____  /\___  >___  >
//          \/          \/                  \/     \/    \/ 
// 

telegrambot.hears('gitBot', (ctx) => {
  ctx.reply('Hello <b>' + ctx.from.username + '</b>. Choose the information to see',
    Extra.HTML()
    .markup(Markup.inlineKeyboard([
      Markup.callbackButton('Repositories', 'repo'),
      Markup.callbackButton('Issues', 'issues')
    ])))
})

telegrambot.action('repo', async function (ctx) {
  try {
    const message = await getRepositories(ctx)
    console.log('REPO MESSAGE: ' + message)
    await ctx.reply('message') 
  } catch (error) {
    ctx.editMessageText('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
})

telegrambot.action('issues', async function (ctx) {
  try {
    const message = await getIssues(ctx)
    console.log('ISSUES MESSAGE: ' + message)
    await ctx.reply('message') 
  } catch (error) {
    ctx.editMessageText('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
})

telegrambot.hears('/test', function (ctx) {
  console.log(ctx);
  ctx.reply( 
    "Hello "+ ctx.from.username + "\n"+
    "our Chat ID is: " + ctx.chat.id + 
    "\nyour Group ID is: " + ctx.from.id);
});

telegrambot.hears('/uptime', async function (ctx) {
  ctx.reply("Uptime: "+ startTime.from(moment(), true));
});

telegrambot.hears(/\/auth (.*):(.*)|\/auth/, async function (msg, match) {
  const airtableToken = match[1] && match[1].split(':')[0];
  const githubToken = match[2];
  const usernameGitHub = 'lucagump';
  const group = 'Telemetria';

  if (!airtableToken && !githubToken) return telegrambot.reply(MESSAGES.AIRTABLE_TOKEN_AND_GITHUB_TOKEN_NOT_SPECIFIED);
  if (!airtableToken) return telegrambot.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
  if (!githubToken) return telegrambot.reply( MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);

  //Check se l'utente è già stato inserito nel db, altrimenti update
  try {
    const message = await authentication(msg,airtableToken,githubToken,usernameGitHub,group)
    console.log(message)
    await ctx.reply( message.usernameTelegram + "i tuoi token sono stati aggiunti correttamente") 
  } catch (error) {
    ctx.reply("Error to Handle")
    console.log(error);
  }

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

telegrambot.hears('/logout', async function (ctx) {
  //Check se l'utente è già stato inserito nel db, altrimenti update
  try {
    const message = await logout(ctx)
    console.log(message)
    await telegrambot.reply(MESSAGES.ACCOUNT_UNLINKED) 
    // Se non posso rimuovere
    // if (message.status = "500") telegrambot.sendMessage(msg.chat.id, MESSAGES.SOMETHING_WENT_WRONG);
    // Se non ti trovo
    // if (message.status = "500") telegrambot.sendMessage(msg.chat.id, MESSAGES.SOMETHING_WENT_WRONG);
  } catch (error) {
    telegrambot.reply(MESSAGES.SOMETHING_WENT_WRONG)
    console.log(error);
  }
});

telegrambot.hears(/\/addIssue(.*):(.*)|\/addIssue/, function (msg, match) {
  const repo = match[1] && match[1].split('@')[0];
  const issue = match[2];
  const telegramId = msg.from.id;

  // Check valid message, check db airtable, create issue on github and airtable
  if (!repo && !token) return telegrambot.reply(MESSAGES.USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED);
  if (!repo) return telegrambot.reply(MESSAGES.USERNAME_NOT_SPECIFIED);
  if (!issue) return telegrambot.reply(MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);

  return telegrambot.reply('Issues created');
});


telegrambot.hears('/getissues', async function (ctx) {
  const data  = await getIssuesTest();
  console.log(msg);
  await ctx.reply(data.page)
});

async function getIssuesTest() {        
  // URL used to retrieve data dinamically
  let url = config.github.test
  try {
    const response = await axios.get(app_domain + '/actions/')
    console.log(response.data);
    return response.data
  } 
  catch(error) {
    console.log("Every time you catch me")
    console.log(error);
  }
};

telegrambot.hears(/\/bookmark (.+)/, (msg, match) => {
  // passlo come parametro per aggiungere valori 
  // siteUrl = match[1];
  telegrambot.reply('Got it, in which category?', {
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

    telegrambot.reply('Added new Reporisotiry!');
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
