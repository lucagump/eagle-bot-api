const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

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

module.exports = telegrambot => {
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
};
