const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

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

module.exports = telegrambot => {
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
};
