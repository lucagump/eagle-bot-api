const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

async function createIssue(msg,title,description,repository){
    try {
      const response = await axios.post(app_domain + '/actions/problems',{
        userID: (msg.from.id).toString(),
        title: title,
        description: description,
        repository: repository
      });
      return response.data
    } catch (error) {
      var errorMessage = "Something bad just happened! Check your Server " + error.status
      console.log(error)
      return errorMessage
    }
}

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
            const message = await createIssue(ctx,title,description,repository)
            return await ctx.reply("Issue is in "+ repository) 
          } catch (error) {
            console.log(error);
            return await ctx.reply("Issue: " + title + " " + "Error to Handle",Extra.HTML())
          } 
        } else {
          ctx.reply("MESSAGES.HELP - Inserisci il numero corretto di valori")
        }
      });

};
