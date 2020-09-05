var schedule = require('node-schedule')
const axios = require('axios')
const moment = require('moment')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const config = require('../../config/config.json')
const MESSAGES = require('./common/messages.js')

const startTime = moment();

const token = process.env.TELEGRAM_TOKEN;// || '1225404853:AAHj66gyJMvEygjmXIyAdewtcRR0g37UHxo';

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

async function setWebhook(){
  try {
    const response = await axios.get('https://api.telegram.org/bot' + token +'/setWebhook' );
    return response.data
  } catch (error) {
    var errorMessage = "Webhook not setted! Restart your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

async function logout(msg){
  try {
    const response = await axios.delete(app_domain + '/actions/users/' + msg.chat.id);
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

async function getAirtableLink(){
  try {
    const response = await axios.get(app_domain + '/airtable/form');
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

async function getMembers(){
  try {
    const response = await axios.get(app_domain + '');
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

// questa rotta viene usata per creare una issue, generalmente viene creata sia su git che su airtable
// ma se viene richiesto può essere creata solo su airtable nel caso non sia relativ alla parte software 
async function createIssue(msg){
  try {
    const response = await axios.get(app_domain + '/actions');
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}
// prende tutte le issues in todo di airtable, se viene specificato un gruppo ritorna solo quelle del gruppo
async function getIssues(msg){
  try {
    const response = await axios.get(app_domain + '');
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}
// repo id-issue user ????
async function assignIssue(msg){
  try {
    const response = await axios.get(app_domain + '');
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}
// POST /orgs/{org}/invitations body:{invitee_id: userToAdd}
async function inviteToOrganization(msg){
  try {
    const response = await axios.post(app_domain + '/actions/users/githubInvitation',{
      'email': email,
  });
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}
// PUT /repos/:owner/:repo/collaborators/:username
async function inviteToCollaborate(msg){
  username = "lucagump"
  repository = "telemetria-web-app"
  try {
    const response = await axios.put(app_domain + '/actions/repositories/'+repository+'/collaborators/'+username);
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
telegrambot.hears('🏁E-Agle🏎Bot🏁', ctx => {
  ctx.reply(MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED, Markup
    .keyboard([
      ['🚀 Create Task and Issue 🚀'], 
      ['🔍 Get Issues', 'Assign Issue 😎'], 
      ['👤 New Member',  'Add Collab 👨‍💻'],
      ['🤖 Bot Settings 🤖']
    ])
    .oneTime()
    .resize()
    .extra()
  )
})
telegrambot.command('eaglebot', ctx => {
  ctx.reply(MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED, Markup
    .keyboard([
      ['🚀 Create Task and Issue 🚀'], 
      ['🔍 Get Issues', 'Assign Issue 😎'], 
      ['👤 New Member',  'Add Collab 👨‍💻'],
      ['🤖 Bot Settings 🤖']
    ])
    .oneTime()
    .resize()
    .extra()
  )
})

telegrambot.hears('🚀 Create Task and Issue 🚀', async ctx => {
  // richiesta per gruppi possibili data chatID, se non ci sono gruppi autenticati in bot settings ecc
  // utilizza i gruppi oppure all

  try {
    const message = await getRepositories(ctx)
    
    await ctx.reply(MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED, Markup
      .keyboard([
        ['🏎🏁E-Agle Bot🏁🏎'], 
        ['🔍 Group 1', 'Group 2 😎'], 
        ['👤 New Member',  'Add Collab 👨‍💻'],
        ['🤖 Bot Settings 🤖']
      ])
      .oneTime()
      .resize()
      .extra()
    )  
  
  } catch (error) {
    ctx.editMessageText('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
})

telegrambot.hears('Assign Issue 😎', ctx => {
  // richiesta per gruppi possibili data chatID, se non ci sono gruppi autenticati in bot settings ecc
  // utilizza i gruppi oppure all
  ctx.reply('')
})

telegrambot.hears('🤖 Bot Settings 🤖', ctx => {
  ctx.reply(MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED, Markup
    .keyboard([
      ['Auth', 'Logout'], 
      ['Uptime', 'Test', 'Help'] 
    ])
    .oneTime()
    .resize()
    .extra()
  )
})

telegrambot.action('repository', async function (ctx) {
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

// telegrambot.hears(/\/auth (.*):(.*)|\/auth/, async function (msg, match) {
//   const airtableToken = match[1] && match[1].split(':')[0];
//   const githubToken = match[2];
//   const usernameGitHub = 'lucagump';
//   const group = 'Telemetria';

//   if (!airtableToken && !githubToken) return telegrambot.reply(MESSAGES.AIRTABLE_TOKEN_AND_GITHUB_TOKEN_NOT_SPECIFIED);
//   if (!airtableToken) return telegrambot.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
//   if (!githubToken) return telegrambot.reply( MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);

//   //Check se l'utente è già stato inserito nel db, altrimenti update
//   try {
//     const message = await authentication(msg,airtableToken,githubToken,usernameGitHub,group)
//     console.log(message)
//     await ctx.reply( message.usernameTelegram + "i tuoi token sono stati aggiunti correttamente") 
//   } catch (error) {
//     ctx.reply("Error to Handle")
//     console.log(error);
//   }
// });

// telegrambot.hears('logout', async function (ctx) {
//   //Check se l'utente è già stato inserito nel db, altrimenti update
//   try {
//     const message = await logout(ctx)
//     console.log(message)
//     await telegrambot.reply(MESSAGES.ACCOUNT_UNLINKED) 
//     // Se non posso rimuovere
//     // if (message.status = "500") telegrambot.sendMessage(msg.chat.id, MESSAGES.SOMETHING_WENT_WRONG);
//     // Se non ti trovo
//     // if (message.status = "500") telegrambot.sendMessage(msg.chat.id, MESSAGES.SOMETHING_WENT_WRONG);
//   } catch (error) {
//     telegrambot.reply(MESSAGES.SOMETHING_WENT_WRONG)
//     console.log(error);
//   }
// });

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


telegrambot.hears('Test', function (ctx) {
  ctx.reply( 
    "Hello "+ ctx.from.username + "\n"+
    "our Chat ID is: " + ctx.chat.id + 
    "\nyour Telegram ID is: " + ctx.from.id);
});

telegrambot.hears('Uptime', async function (ctx) {
  ctx.reply("Uptime: "+ startTime.from(moment(), true));
});

telegrambot.hears('👤 New Member', async function (ctx) {
  try {
    const message = await getAirtableLink()
    await ctx.reply('Click on the link and fill the <b>Form</b> \n\n' + message, Extra.HTML()) 
  } catch (error) {
    ctx.editMessageText('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
})




telegrambot.action(/.+/, (ctx) => {
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})
telegrambot.command('inline', (ctx) => {
  var dataToPass = 'gatto cannne + gatto + droga'
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('Coke', dataToPass),
      m.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
      m.callbackButton('Pepsi', 'Pepsi')
    ])))
})

telegrambot.command('custom', ({ reply }) => {
  return reply('Custom buttons keyboard', Markup
    .keyboard([
      ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
      ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
      ['📢 Ads 🤘👌💪🤝🏎🏁🧺⚡👨‍💻👤😴', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
    ])
    .oneTime()
    .resize()
    .extra()
  )
})


var scheduledMessage = schedule.scheduleJob('30 18 * * *', function () {
  setWebhook()
});

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
