const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {

  telegrambot.hears('Assign Issue 😎', async function (ctx) {
    await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
    return ctx.reply("To assign an issue just send the command as describe in the example below: \n\n /assignissue repository issueID githubUsername")
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
      
        const response = (await axios.post(app_domain + '/business/issues/'+issueID,{
          userID: (ctx.from.id).toString(),
          username: username,
          repository: repository
        })).data
        
        if(response.status == "fail"){
          return ctx.reply("Issue: " + issueID + " cannot be assigned",Extra.HTML())
        }

        return await ctx.reply("Issue assigned to " + username) 
      
      } catch (error) {
        console.log(error);
        return ctx.reply("Issue: " + issueID + " cannot be assigned",Extra.HTML())
      } 
    } else {
      ctx.reply("To assign an issue just send the command as describe in the example below: \n\n /assignissue repository issueID githubUsername")
    }
  });

};
