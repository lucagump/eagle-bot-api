const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {
  telegrambot.hears('🤖Authentication', async function (ctx) {
    // await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
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
        const response = (await axios.post(app_domain + '/process/login',{
          userID: (ctx.from.id).toString(),
          chatID: (ctx.chat.id).toString(),
          usernameTelegram: ctx.from.username,
          usernameGitHub: usernameGitHub,
          groups: groups,
          githubToken: githubToken,
          airtableToken: airtableToken,
          airtableBase: airtableBase,
        })).data;

        if ( response.status == "fail") {
          return ctx.reply("User: " + ctx.from.username + " cannot login. \n" + response.errorMessage,Extra.HTML())          
        }
        return ctx.reply( ctx.from.username + " is logged in correctly") 

      } catch (error) {
        console.log(error);
        await ctx.reply(ctx.from.username + " cannot login")
      } 
    } else {
      ctx.reply("Send the command in this format: \n\n"+
      "/authentication airtableToken airtableBase githubToken usernameGitHub group1 group2"
    );
    }
  });
};
