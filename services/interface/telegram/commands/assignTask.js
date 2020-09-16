const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

async function assignTask(ctx,taskID,username){
  try {
    const response = await axios.put(app_domain + '/business/tasks/'+ taskID,{
      'userID': (ctx.from.id).toString(),
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
    // await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
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
        const response = (await axios.put(app_domain + '/business/tasks/'+ taskID,{
          'userID': (ctx.from.id).toString(),
          'username': username,
        })).data;
        
        if ( response.status == "fail") {
          return ctx.reply("Task: " + taskID + " cannot be assigned",Extra.HTML())          
        }

        return ctx.reply("Task: " + response.data.Task + " - is in "+ response.data.Status + "\n\n" + " ID: " + response.data.id,Extra.HTML())          

      } catch (error) {
        console.log(error);
        return ctx.reply("Task: " + taskID + " cannot be assigned",Extra.HTML())
      } 
    } else {
      ctx.reply("To assign a task just send the command as describe in the example below: \n\n /assigntask taskID githubUsername")
    }
  });

};
