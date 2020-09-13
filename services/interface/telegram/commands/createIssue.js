const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {

    telegrambot.command('newissue', async function (ctx) {
        var title = null;
        var description = null;
        var repository = null;
        
        var inputData = ctx.update.message.text.split(" / ")
        console.log(inputData)
        
        if (inputData.length > 3 ) {
          title = inputData[1]; 
          description = inputData[2];
          repository = inputData[3];
      
          try {
            
            const response = (await axios.post(app_domain + '/process/issues',{
              userID: (ctx.from.id).toString(),
              title: title,
              description: description,
              repository: repository
            })).data;
            
            if (response.status == "fail") {
              return ctx.reply("I can't create the issue sorry :(") 
            }  
            
            return await ctx.reply("Issue is in "+ repository) 
          } catch (error) {
            console.log(error);
            return await ctx.reply("Issue: '" + title + "' " + "Error to Handle",Extra.HTML())
          } 
        } else {
          ctx.reply("MESSAGES.HELP - Inserisci il numero corretto di valori")
        }
      });

};
