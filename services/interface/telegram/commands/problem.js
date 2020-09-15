const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {

  telegrambot.command('problem', async function (ctx) {
    var title = null;
    var description = null;
    var repository = null;
    var groups = null;
  
    var inputData = ctx.update.message.text.split(" / ")
    console.log(inputData)
    
    if (inputData.length > 4 ) {
      title = inputData[1]; 
      description = inputData[2];
      repository = inputData[3];
      groups = inputData[4];
  
      try {
        const response = (await axios.post(app_domain + '/process/problems',{
          userID: (ctx.from.id).toString(),
          title: title,
          description: description,
          repository: repository,
          groups: groups
        })).data;

        if(response.status == "fail"){
          return ctx.reply("I can't create the issue or the task, sorry :(",Extra.HTML())
        }

        return await ctx.reply(title + " - Issue is in "+ repository + " and in Airtable\n\n"+
        "Airtable : "+ response.data.airtableTask +"\n"+" github : "+ response.data.githubIssue+"\n") 

      } catch (error) {
        console.log(error);
        return await ctx.reply("Issue: " + title + " " + "Error to Handle",Extra.HTML())
      } 
    } else {
      ctx.reply("Send the command in this format:\n\n"+
      '/problem / title / description / repository / group \n\n')
    }
  });

};
