const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {

    telegrambot.command('newtask', async function (ctx) {
        var title = null;
        var description = null;
        var groups = null;
      
        var inputData = ctx.update.message.text.split(" / ")
        
        if (inputData.length > 3 ) {
          title = inputData[1]; 
          description = inputData[2];
          groups = inputData[3];
          
          try {
            const response = (await axios.post(app_domain + '/process/tasks/' + groups,{
              userID: (ctx.from.id).toString(),
              title: title,
              description: description,
              groups: groups
            })).data;

            if (response.status == "fail") {
              return ctx.reply("I can't create the task sorry :(") 
            }  

            return await ctx.reply("Task is in "+ groups + " check on Airtable " + response.data.id) 
          } catch (error) {
            console.log(error);
            return await ctx.reply("Task: '" + title + "' " + "Error to Handle",Extra.HTML())
          } 
        } else {
          ctx.reply("Send the command in this format:\n\n"+
            '/newtask / title / description / group \n')
        }
    });
      
};
