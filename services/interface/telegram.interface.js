const cron = require('node-cron')
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

cron.schedule("* */1 * * *", () => {
  setWebhook()
}); 

async function setWebhook(){
  // try {
  //   const response = await axios.get('https://api.telegram.org/bot' + token +'/setWebhook' );
  //   console.log(response.data)
  //   return response.data
  // } catch (error) {
  //   var errorMessage = "Webhook not setted! Restart your Server " + error.status
  //   console.log(error)
  //   return errorMessage
  // }
}

async function authentication(msg,airtableToken,airtableBase,githubToken,usernameGitHub,groups){
  try {
    const response = await axios.post(app_domain + '/actions/users',{
      userID: (msg.from.id).toString(),
      chatID: (msg.chat.id).toString(),
      usernameTelegram: msg.from.username,
      usernameGitHub: usernameGitHub,
      groups: groups,
      githubToken: githubToken,
      airtableToken: airtableToken,
      airtableBase: airtableBase,
    });
    if(response.status == 404){
      return "404 - Cannot add user"
    }
    return response.data
  } catch (error) {
      var errorMessage = "Something bad just happened! Check your Server " + error.status
      console.log(error)
      return errorMessage
  }
}
async function logout(msg){
  try {
    const response = await axios.delete(app_domain + '/actions/users/' + msg.from.id);
    return response
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    //console.log(error)
    return error
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
async function inviteToOrganization(email){
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
async function inviteToCollaborate(repository,username){
  try {
    const response = await axios.put(app_domain + '/actions/repositories/'+repository+'/collaborators/'+username);
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
async function getGroups(msg){
  try {
    const response = await axios.get(app_domain + '/actions/users/'+msg.from.id);
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
} 
async function getGroupTasks(msg){
  try {
    const response = await axios.get(app_domain + '/actions/tasks/'+msg.match[0]+'/'+msg.from.id);
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
} 
async function getRepositories(msg){
  try {
    const response = await axios.get(app_domain + '/actions/repositories/'+msg.from.id);
    return response
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
} 
async function createIssue(msg,title,description,repository){
  try {
    const response = await axios.post(app_domain + '/actions/problems',{
      userID: (msg.from.id).toString(),
      title: title,
      description: description,
      repository: repository
    });
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}
async function createTask(msg,title,description,group){
  try {
    const response = await axios.post(app_domain + '/actions/tasks',{
      userID: (msg.from.id).toString(),
      title: title,
      description: description,
      group: group
    });
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}
async function createIssueTask(msg,title,description,repository,group){
  try {
    const response = await axios.post(app_domain + '/actions/issues',{
      userID: (msg.from.id).toString(),
      title: title,
      description: description,
      repository: repository,
      group: group
    });
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

// 
// .___        __                 _____                     
// |   | _____/  |_  ____________/ ____\____    ____  ____  
// |   |/    \   __\/ __ \_  __ \   __\\__  \ _/ ___\/ __ \ 
// |   |   |  \  | \  ___/|  | \/|  |   / __ \\  \__\  ___/ 
// |___|___|  /__|  \___  >__|   |__|  (____  /\___  >___  >
//          \/          \/                  \/     \/    \/ 
// 

// Alias in Menu to go back 
telegrambot.hears('🏎🏁E-Agle Bot🏁🏎', async ctx => {
  ctx.reply(MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED, Markup
    .keyboard([
      ['🚀 Tasks and Issues 🚀'], 
      ['👤 New Member',  'Add Collab 👨‍💻','Join Org🤝'],
      ['🤖 Bot Settings 🤖']
    ])
    .oneTime()
    .resize()
    .extra()
  )
});
telegrambot.command('eaglebot', async ctx => {
  ctx.reply("Select an Action to start", Markup
    .keyboard([
      ['🚀 Tasks and Issues 🚀'], 
      ['👤 New Member',  'Add Collab 👨‍💻','Join Org🤝'],
      ['🤖 Bot Settings 🤖']
    ])
    .oneTime()
    .resize()
    .extra()
  )
});

telegrambot.hears('👤 New Member', async function (ctx) {
  try {
    const message = await getAirtableLink()
    await ctx.reply('Click on the <i>link</i> and fill the <b>Form</b> \n\n' + message, Extra.HTML()) 
  } catch (error) {
    ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
});
telegrambot.hears('Add Collab 👨‍💻', async function (ctx) {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  ctx.reply("Ora devi inserire username e repository, nel seguente formato");
});
telegrambot.command('collaboration', async function (ctx) {
  var username = null;
  var repository = null;
  
  var inputData = ctx.update.message.text.split(" ")
  console.log(inputData.length)
  
  if (inputData.length > 2 ) {
    username = inputData[1];
    repository = inputData[2];
  
    if (!username && !repository) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_AND_GITHUB_TOKEN_NOT_SPECIFIED);
    if (!username) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    if (!repository) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    
    //Check se l'utente è già stato inserito nel db, altrimenti update
    try {
      const message = await inviteToCollaborate(repository,username)
      await ctx.reply(username + "has been invited to collaborate in "+repository) 
    } catch (error) {
      await ctx.reply(username + " " + message + " " + "Error to Handle")
      console.log(error);
    } 
  } else {
    ctx.reply("MESSAGES.HELP - Inserisci il numero corretto di valori")
  }
});
telegrambot.hears('Join Org🤝', async function (ctx) {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  ctx.reply("Ora devi inserire la email nel seguente formato");
});
telegrambot.command('organization', async function (ctx) {
  var email = null;
  
  var inputData = ctx.update.message.text.split(" ")
  console.log(inputData.length)
  
  if (inputData.length > 3 ) {
    username = inputData[1];
    repository = inputData[2];
  
    if (!email) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    
    //Check se l'utente è già stato inserito nel db, altrimenti update
    try {
      const message = await inviteToOrganization(email)
      return await ctx.reply(email + "has been invited to join organization") 
    } catch (error) {
      console.log(error);
      return await ctx.reply(email + " " + message + " " + "Error to Handle")
    } 
  } else {
    ctx.reply("MESSAGES.HELP - Inserisci il numero corretto di valori")
  }
});

// TASK AND ISSUES
telegrambot.hears('🚀 Tasks and Issues 🚀', async ctx => {
  try {
    await ctx.reply("Select an Action to start",Markup
      .keyboard([
        ['🏎🏁E-Agle Bot🏁🏎'], 
        ['🔍 Get Tasks', 'New Issue 😎'], 
        ['👤 New Member',  'Add Collab 👨‍💻'],
        ['🤖 Bot Settings 🤖']
      ])
      .oneTime()
      .resize()
      .extra()
    )  
  
  } catch (error) {
    ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
});
telegrambot.command('problem', async function (ctx) {
  var title = null;
  var description = null;
  var repository = null;
  var group = null;

  var inputData = ctx.update.message.text.split(" / ")
  console.log(inputData)
  
  if (inputData.length > 4 ) {
    title = inputData[1]; 
    description = inputData[2];
    repository = inputData[3];
    group = inputData[4];

    if (!title) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    if (!description) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    if (!repository) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    if (!group) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    
    try {
      const message = await createIssueTask(ctx,title,description,repository,group)
      return await ctx.reply("Issue is in "+ repository + " and in Airtable") 
    } catch (error) {
      console.log(error);
      return await ctx.reply("Issue: " + title + " " + "Error to Handle",Extra.HTML())
    } 
  } else {
    ctx.reply("MESSAGES.HELP - Inserisci il numero corretto di valori")
  }
});
telegrambot.command('newissue', async function (ctx) {
  var title = null;
  var description = null;
  var repository = null;
  
  var inputData = ctx.update.message.text.split(" / ")
  console.log(inputData)
  
  if (inputData.length > 3 ) {
    title = inputData[1]; 
    description = inputData[2];
    repository = inputData[3];

    if (!title) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    if (!description) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    if (!repository) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    
    try {
      const message = await createIssue(ctx,title,description,repository)
      return await ctx.reply("Issue is in "+ repository) 
    } catch (error) {
      console.log(error);
      return await ctx.reply("Issue: " + title + " " + "Error to Handle",Extra.HTML())
    } 
  } else {
    ctx.reply("MESSAGES.HELP - Inserisci il numero corretto di valori")
  }
});
telegrambot.command('newtask', async function (ctx) {
  var title = null;
  var description = null;
  var group = null;

  var inputData = ctx.update.message.text.split(" / ")
  
  if (inputData.length > 3 ) {
    title = inputData[1]; 
    description = inputData[2];
    group = inputData[3];

    if (!title) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    if (!description) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    if (!group) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    
    try {
      const message = await createTask(ctx,title,description,group)
      return await ctx.reply("Task is in "+ group + " check on Airtable") 
    } catch (error) {
      console.log(error);
      return await ctx.reply("Task: " + title + " " + "Error to Handle",Extra.HTML())
    } 
  } else {
    ctx.reply("MESSAGES.HELP - Inserisci il numero corretto di valori")
  }
});
telegrambot.command('repositories', async function (ctx) {
  try {
    const response = (await getRepositories(ctx)).data
    var text = '';
    for (var i = 0; i < response.length; i++) {
        text += response[i] + ' \n';
    }
    await ctx.reply("Here a list of yours repositories \n\n"+text,Extra.HTML()) 
  } catch (error) {
    ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
}); // todo
telegrambot.hears('New Issue 😎', async ctx => {
  ctx.reply('Here we are! You can create a new issue or a new task as showed below, '+
  'you can do both using /problem \n\n'+
  '/newissue / title / description / repository \n' +
  '/newtask / title / description / group \n' +
  '/problem / title / description / repository /group \n\n' +
  '<i>Problems with Repositories and Groups? use /repositories and /group 😊</i>',Extra.HTML())
});
telegrambot.action(/.+/, async (ctx) => {
  try {
    const response = await getGroupTasks(ctx)
    ctx.answerCbQuery(`Check the Tasks in ${ctx.match[0]}!`)
    ctx.reply('TASKS <b>Group</b>', Extra.HTML()) 
  } catch (error) {
    ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
})
telegrambot.hears('🔍 Get Tasks', async (ctx) => {
  try {
    const response = await getGroups(ctx)
    return ctx.reply('Select a <b>Group</b>', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton(response.groups[0], response.groups[0]),
      m.callbackButton(response.groups[1], response.groups[1]),
    ])))  
  
  } catch (error) {
    ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
})


// BOT SETTINGS 
telegrambot.hears('🤖 Bot Settings 🤖', async ctx => {
  ctx.reply("Select an Action to start",Markup
    .keyboard([
      ['🏎🏁E-Agle Bot🏁🏎'],
      ['🤖Authentication', 'Logout😴'], 
      ['Uptime🏁', 'Test🤘', 'Help👨‍💻'] 
    ])
    .oneTime()
    .resize()
    .extra()
  )
});
telegrambot.hears('🤖Authentication', async function (ctx) {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  ctx.reply("Ora devi inserire i valori per l'autenticazione, nel seguente formato");
});
telegrambot.command('authentication', async function (ctx) {
  var airtableToken = null;
  var airtableBase = null;
  var githubToken = null;
  var usernameGitHub = null;
  var groups = [];
  
  console.log(ctx.update.message.text)
  var inputData = ctx.update.message.text.split(" ")
  console.log(inputData.length)
  
  if (inputData.length > 6 ) {
    airtableToken = inputData[1];
    airtableBase = inputData[2];
    githubToken = inputData[3];
    usernameGitHub = inputData[4];
    for (let index = 5; index < inputData.length; index++) {
      groups.push(inputData[index]); 
    }
  
    if (!airtableToken && !githubToken) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_AND_GITHUB_TOKEN_NOT_SPECIFIED);
    if (!airtableToken) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    if (!airtableBase) return ctx.reply(MESSAGES.AIRTABLE_TOKEN_NOT_SPECIFIED);
    if (!githubToken) return ctx.reply( MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);
    if (!groups) return ctx.reply( MESSAGES.GROUPS_NOT_SPECIFIED);
  
    //Check se l'utente è già stato inserito nel db, altrimenti update
    try {
      const message = await authentication(ctx,airtableToken,airtableBase,githubToken,usernameGitHub,groups)
      await ctx.reply( ctx.from.username + "i tuoi token sono stati aggiunti correttamente") 
    } catch (error) {
      await ctx.reply(ctx.from.username + " " + message + " " + "Error to Handle")
      console.log(error);
    } 
  } else {
    ctx.reply("MESSAGES.HELP - Inserisci il numero corretto di valori")
  }
});
telegrambot.hears('Logout😴', async function (ctx) {
  try {
    const message = await logout(ctx)
    console.log(message)
    // Se non posso rimuovere
    //if (message.status = "500") ctx.reply(MESSAGES.SOMETHING_WENT_WRONG);
    // Se non ti trovo
    //if (message.status = "404") ctx.reply(message.data);
    //await ctx.reply(MESSAGES.ACCOUNT_UNLINKED) 
  } catch (error) {
    ctx.reply(MESSAGES.SOMETHING_WENT_WRONG)
    console.log(error);
  }
});
telegrambot.hears('Test🤘', function (ctx) {
  ctx.reply( 
    "Hello "+ ctx.from.username + "\n"+
    "our Chat ID is: " + ctx.chat.id + 
    "\nyour Telegram ID is: " + ctx.from.id);
});
telegrambot.hears('Uptime🏁', async function (ctx) {
  ctx.reply("Uptime: "+ startTime.from(moment(), true));
});
telegrambot.hears('Help👨‍💻', async function (ctx) {
  ctx.reply(MESSAGES.HELP);
});






telegrambot.hears('/getissues', async function (ctx) {
  const data  = await getIssuesTest();
  console.log(data);
  await ctx.reply(data.page)
});


















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

