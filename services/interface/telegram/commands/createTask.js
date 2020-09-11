const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

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

module.exports = telegrambot => {

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
      
};
