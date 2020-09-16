const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');



module.exports = telegrambot => {
  telegrambot.hears('Join Org🤝', async function (ctx) {
    // await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
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
        const response = (await axios.post(app_domain + '/business/users/githubInvitation',{
          'userID': ctx.from.id,
          'email': email
        })).data; 
        
        if(response.status == "fail"){
          return ctx.reply("I can't invite the user to join the organization, maybe he is already part of it or the eamil is not correct, sorry :(",Extra.HTML())
        }
        console.log(response)
        return await ctx.reply(email + " has been invited to join organization") 
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
