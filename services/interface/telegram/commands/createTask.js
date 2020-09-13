const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

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
            const response = (await axios.post(app_domain + '/process/tasks/' + group,{
              userID: (ctx.from.id).toString(),
              title: title,
              description: description,
              group: group
            })).data;

            if (response.status == "fail") {
              return ctx.reply("I can't create the task sorry :(") 
            }  

            return await ctx.reply("Task is in "+ group + " check on Airtable") 
          } catch (error) {
            console.log(error);
            return await ctx.reply("Task: '" + title + "' " + "Error to Handle",Extra.HTML())
          } 
        } else {
          ctx.reply("MESSAGES.HELP - Inserisci il numero corretto di valori")
        }
    });
      
};
