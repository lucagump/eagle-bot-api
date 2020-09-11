const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

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
  
  
};
