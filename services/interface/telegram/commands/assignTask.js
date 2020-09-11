const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

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

module.exports = telegrambot => {

  telegrambot.hears('⭐️ Assign Task', async function (ctx) {
    await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
    return ctx.reply("To assign a task just send the command as describe in the example below: \n\n /assigntask taskID githubUsername")
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

};
