const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

async function createIssueTask(msg,title,description,repository,group){
  try {
    const response = await axios.post(app_domain + '/actions/issues',{
      userID: (msg.from.id).toString(),
      title: title,
      description: description,
      repository: repository,
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

  telegrambot.command('problem', async function (ctx) {
    var title = null;
    var description = null;
    var repository = null;
    var group = null;
  
    var inputData = ctx.update.message.text.split(" / ")
    console.log(inputData)
    
    if (inputData.length > 4 ) {
      title = inputData[1]; 
      description = inputData[2];
      repository = inputData[3];
      group = inputData[4];
  
      try {
        const message = await createIssueTask(ctx,title,description,repository,group)
        return await ctx.reply("Issue is in "+ repository + " and in Airtable") 
      } catch (error) {
        console.log(error);
        return await ctx.reply("Issue: " + title + " " + "Error to Handle",Extra.HTML())
      } 
    } else {
      ctx.reply("MESSAGES.HELP - Inserisci il numero corretto di valori")
    }
  });

};
