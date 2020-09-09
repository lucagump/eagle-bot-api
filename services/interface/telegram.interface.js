const cron = require('node-cron')
const axios = require('axios')
const moment = require('moment')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const config = require('../../config/config.json')
const MESSAGES = require('./common/messages.js')

const startTime = moment();

const token = '1225404853:AAHj66gyJMvEygjmXIyAdewtcRR0g37UHxo' // process.env.TELEGRAM_TOKEN;

const telegrambot = new Telegraf(token)

// if(process.env.NODE_ENV === 'production') {
//   telegrambot.webhookReply = true
// }

telegrambot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const response_time = new Date() - start
  console.log(`(Response Time: ${response_time})`)
})




telegrambot.launch()

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
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
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
async function inviteToOrganization(msg,email){
  try {
    const response = await axios.post(app_domain + '/actions/users/githubInvitation',{
      'userID': msg.from.id,
      'email': email
  });
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}
async function inviteToCollaborate(msg,repository,username){
  try {
    const response = await axios.put(app_domain + '/actions/repositories/'+repository+'/collaborators/'+username,{
      userID: msg.from.id
    });
    if(response.status == 204){
      return "204"
    }
    return response.data
  } catch (error) {
    return error.message
  }
}
async function getMembers(msg){
  try {
    const response = await axios.get(app_domain + '/actions/groups/members',{
      data:{
        userID: msg.from.id
      }
    });
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}
async function getMember(msg,username){
  try {
    const response = await axios.get(app_domain + '/actions/groups/members/'+username,{
      data:{
        userID: msg.from.id
      }
    });
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
    return error
  }
} 
async function getGroupTasks(msg){
  try {
    const response = await axios.get(app_domain + '/actions/tasks/groups/'+msg.match[0]+'/'+msg.from.id);
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
async function getIssues(msg,repository){
  try {
    const response = await axios.get(app_domain + '/actions/issues/'+repository,{
      data:{
        'userID': (msg.from.id).toString()
      }
    });
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}
async function assignIssue(msg,repository,issueID,username){
  try {
    const response = await axios.post(app_domain + '/actions/issues/'+issueID,{
      userID: (msg.from.id).toString(),
      username: username,
      repository: repository
    });
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}
async function assignTask(msg,taskID,username){
  try {
    const response = await axios.put(app_domain + '/actions/tasks/'+taskID,{
      'userID': (msg.from.id).toString(),
      'username': username,
    });
    console.log(response)
    return response
  } catch (error) {
    console.log(error)
    var errorMessage = "Something bad just happened! Check your Server"
    return errorMessage
  }
}
async function getRepositoriesGroups(msg){
  try {
    const response = await axios.get(app_domain + '/actions/topics/repositories/'+ msg.from.id);
    return response.data
  } catch (error) {
    return error
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
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
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
  ctx.reply("Send the command in this format:\n\n"+
    "/collaboration username repository");
});
telegrambot.command('collaboration', async function (ctx) {
  var username = null;
  var repository = null;
  
  var inputData = ctx.update.message.text.split(" ")
  
  if (inputData.length > 2 ) {
    username = inputData[1];
    repository = inputData[2];
  
    try {
      const message = await inviteToCollaborate(ctx,repository,username)
      if(message == "204") {
        return ctx.reply("User is already a collaborator")
      }
      return ctx.reply(username + " has been invited to collaborate in "+repository) 
    } catch (error) {
      await ctx.reply(username + " " + message + " " + "Error to Handle")
      console.log(error);
    } 
  } else {
    ctx.reply("Send the command in this format:\n\n"+
    "/collaboration username repository");
  }
});
telegrambot.hears('Join Org🤝', async function (ctx) {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  ctx.reply("Send the command in this format: \n\n"+
    "/organization email");
});
telegrambot.command('organization', async function (ctx) {
  var email = null;
  
  var inputData = ctx.update.message.text.split(" ")
  console.log(inputData.length)
  
  if (inputData.length > 1 ) {
    email = inputData[1];
  
    try {
      const message = await inviteToOrganization(ctx,email)
      return await ctx.reply(email + "has been invited to join organization") 
    } catch (error) {
      console.log(error);
      return await ctx.reply(email + " " + message + " " + "Error to Handle")
    } 
  } else {
    ctx.reply("Send the command in this format: \n\n"+
    "/organization email");
  }
});

// TASK AND ISSUES
telegrambot.hears('🚀 Tasks and Issues 🚀', async ctx => {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  try {
    await ctx.reply("Select an Action to start",Markup
      .keyboard([
        ['🏎🏁E-Agle Bot🏁🏎'], 
        ['🔍 Get Tasks', '⭐️ Assign 📢','New Issue 😎'], 
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
// TASK AND ISSUES - ASSIGN TASK / ASSIGN ISSUE
telegrambot.hears('⭐️ Assign 📢', async ctx => {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)

  try {
    await ctx.reply("Select an Action to start",Markup
      .keyboard([
        ['🚀 Tasks and Issues 🚀'], 
        ['⭐️ Assign Task', 'Assign Issue 😎'], 
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
telegrambot.hears('⭐️ Assign Task', async function (ctx) {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  return ctx.reply("To assign a task just send the command as describe in the example below: \n\n /assigntask taskID githubUsername")
});
telegrambot.hears('Assign Issue 😎', async function (ctx) {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  return ctx.reply("To assign an issue just send the command as describe in the example below: \n\n /assignissue repository issueID githubUsername")
});
telegrambot.command('assigntask', async function (ctx) {
  var taskID = null;
  var username = null;
  
  var inputData = ctx.update.message.text.split(" ")
  console.log(inputData)
  
  if (inputData.length > 2 ) {
    taskID = inputData[1]; 
    username = inputData[2];

    try {
      const message = await assignTask(ctx,taskID,username)
      if ( message == "Something bad just happened! Check your Server") {
        return ctx.reply(message.data) 
      }
      return ctx.reply(message.data) 
    } catch (error) {
      console.log(error);
      return ctx.reply("Task: " + taskID + " cannot be assigned",Extra.HTML())
    } 
  } else {
    ctx.reply("To assign a task just send the command as describe in the example below: \n\n /assigntask taskID githubUsername")
  }
});
telegrambot.command('assignissue', async function (ctx) {
  var repository = null;
  var issueID = null;
  var username = null;
  
  var inputData = ctx.update.message.text.split(" ")
  console.log(inputData)
  
  if (inputData.length > 2 ) {
    repository = inputData[1];
    issueID = inputData[2]; 
    username = inputData[3];

    try {
      const message = await assignIssue(ctx,repository,issueID,username)
      if( message.title == null){
        return ctx.reply("Issue: " + issueID + " cannot be assigned",Extra.HTML())
      }
      return await ctx.reply("Issue assign to "+ username) 
    } catch (error) {
      console.log(error);
      return await ctx.reply("Issue: " + issueID + " cannot be assigned",Extra.HTML())
    } 
  } else {
    ctx.reply("To assign an issue just send the command as describe in the example below: \n\n /assignissue repository issueID githubUsername")
  }
});
telegrambot.hears('New Issue 😎', async ctx => {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)

  ctx.reply('Here we are! You can create a new issue or a new task as showed below, '+
  'you can do both using /problem \n\n'+
  '/newissue / title / description / repository \n' +
  '/newtask / title / description / group \n' +
  '/problem / title / description / repository / group \n\n' +
  '<i>Problems with Repositories and Groups? use /repositories and /groups 😊</i>',Extra.HTML())
});
//OK
telegrambot.command('groups', async (ctx) => {
  try {
    const response = await getGroups(ctx)
    return ctx.reply('Here are yours Groups: \n\n' + response.groups[0] + "\n" + response.groups[1], Extra.HTML)
  } catch (error) {
    ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
});
// OK
telegrambot.command('members', async (ctx) => {
  var username = null
  var text = ''
  var inputData = ctx.update.message.text.split(" ")
  
  if (inputData.length > 1 ) {
    username = inputData[1];
  }
  try {
    if (username == null){
      response = await getMembers(ctx)
      for (var i = 0; i < response.length; i++) {
          text += response[i].name + ' - tasks: ' + response[i].tasks.length +' \n';
      }
      await ctx.reply("Here the Members list \n\n"+text,Extra.HTML()) 
    } else {
      response = await getMember(ctx,username)
      if (response == null){
        return ctx.reply(username + " is not a member, sorry")
      }
      text += '' + response.name + ' tasks: ' + response.tasks.length +' \n';
      await ctx.reply("Here " + username+ "! \n\n" + text,Extra.HTML()) 
    }

  } catch (error) {
    ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
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
});
telegrambot.command('grouprepositories', async function (ctx) {
  try {
    const response = await getRepositoriesGroups(ctx)
    if (response.response.status == "404") {
      return ctx.reply(MESSAGES.UNAUTHORIZED) 
    }     
    var text = '';
    for(var k in response) {
      text += "\n" +  k + '\n\n'; 
      response[k].forEach(function(element) {
        text += element + '\n'
      })    
    }
    await ctx.reply("Here a list of yours <b>Repositories</b> \n"+text,Extra.HTML()) 
  } catch (error) {
    ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
});
telegrambot.action(/.+/, async (ctx) => {
  if(ctx.match[0] == "yes"){
    try {
      const message = await logout(ctx)
      if ( message.response.status == "404") {
        return ctx.reply("Your account is already unlinked") 
      } 
      return ctx.reply(MESSAGES.ACCOUNT_UNLINKED) 
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  } if (ctx.match[0] == "no") {
    return ctx.reply('It\'s fine <i>I\'m here</i> for you 😊',Extra.HTML())
  } else {
    try {
      const response = await getGroupTasks(ctx)
      var text = '';
      for (var i = 0; i < response.length; i++) {
          text += response[i].task + ' \n';
      }
      ctx.answerCbQuery(`Check the Tasks in ${ctx.match[0]}!`)
      await ctx.reply("Here a list of yours <b>tasks</b> \n\n"+text,Extra.HTML()) 
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  }
});
telegrambot.hears('🔍 Get Tasks', async (ctx) => {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)

  try {
    const response = await getGroups(ctx)
    console.log(response)
    if (response.response.status == "404") {
      return ctx.reply(MESSAGES.UNAUTHORIZED) 
    } 
    return ctx.reply('Select a <b>Group</b>', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton(response.groups[0], response.groups[0]),
      m.callbackButton(response.groups[1], response.groups[1]),
    ])))  
  
  } catch (error) {
    ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
    console.log(error);
  }
});
// OK
telegrambot.command('getissues', async function (ctx) {
  var repository = null;
  
  var inputData = ctx.update.message.text.split(" ")
  console.log(inputData.length)
  
  if (inputData.length > 1 ) {
    repository = inputData[1];
    
    try {
      const response = await getIssues(ctx,repository)
      if( response == '404 - Repository not Found'){
        return ctx.reply("Can't finde the <b>repository</b> \n\n"+text,Extra.HTML()) 
      }
      var text = '';
      
      response.forEach(element => {
        text += '>' + element.title + ' \n';
      });
      
      await ctx.reply("Here a list of yours <b>issues</b> \n\n"+text,Extra.HTML()) 
    } catch (error) {
      await ctx.reply(response + " " + "Error to Handle")
      console.log(error);
    } 
  } else {
    ctx.reply("To get the issues just send the command as describe in the example below: \n\n /getissues repository")
  }
});


// BOT SETTINGS 
telegrambot.hears('🤖 Bot Settings 🤖', async ctx => {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)

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
  ctx.reply("Send the command in this format:"+
    "/authentication airtableToken airtableBase githubToken usernameGitHub group1 group2"
  );
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

    //Check se l'utente è già stato inserito nel db, altrimenti update
    try {
      const message = await authentication(ctx,airtableToken,airtableBase,githubToken,usernameGitHub,groups)
      await ctx.reply( ctx.from.username + "i tuoi token sono stati aggiunti correttamente") 
    } catch (error) {
      await ctx.reply(ctx.from.username + " " + message + " " + "Error to Handle")
      console.log(error);
    } 
  } else {
    ctx.reply("Send the command in this format:"+
    "/authentication airtableToken airtableBase githubToken usernameGitHub group1 group2"
  );
  }
});
telegrambot.hears('Logout😴', async function (ctx) {
  await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)

  return ctx.reply('Are you sure?', Extra.HTML().markup((m) =>
  m.inlineKeyboard([
    m.callbackButton(" Yes ", "yes"),
    m.callbackButton(" No ", "no"),
  ])))

});
telegrambot.hears('Test🤘', function (ctx) {
  ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  ctx.reply( 
    "Hello "+ ctx.from.username + "\n"+
    "our Chat ID is: " + ctx.chat.id + 
    "\nyour Telegram ID is: " + ctx.from.id);
});
telegrambot.hears('Uptime🏁', function (ctx) {
  ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  ctx.reply("Uptime: "+ startTime.from(moment(), true));
});
telegrambot.hears('Help👨‍💻', function (ctx) {
  ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  ctx.reply(MESSAGES.HELP);
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

