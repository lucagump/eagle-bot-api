const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {

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
        
        const response = (await axios.put(app_domain + '/business/repositories/'+repository+'/collaborators/'+username,{
          userID: ctx.from.id
        })).data;

        if (response.status == "fail") {
          return ctx.reply("I can't invite the user, check the username or repository") 
        }  
        
        return ctx.reply(username + " has been invited to collaborate in "+repository) 
      } catch (error) {
        console.log(error);
        ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML());
      } 
    } else {
      ctx.reply("Send the command in this format:\n\n"+
      "/collaboration username repository");
    }
  });
  
  
};
