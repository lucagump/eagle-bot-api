const axios = require('axios')
const Extra = require('telegraf/extra')
const { MESSAGES } = require('../common');

async function getIssues(msg,repository){
  try {
    const response = await axios.get(app_domain + '/actions/issues/'+repository,{
      data:{
        'userID': (msg.from.id).toString()
      }
    });
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

module.exports = telegrambot => {

  telegrambot.command('getissues', async function (ctx) {
    var repository = null;
    
    var inputData = ctx.update.message.text.split(" ")
    console.log(inputData.length)
    
    if (inputData.length > 1 ) {
      repository = inputData[1];
      
      try {
        const response = await getIssues(ctx,repository)
        if( response == '404 - Repository not Found'){
          return ctx.reply("Can't finde the <b>repository</b> \n\n"+text,Extra.HTML()) 
        }
        var text = '';
        
        response.forEach(element => {
          text += '>' + element.title + ' \n';
        });
        
        await ctx.reply("Here a list of yours <b>issues</b> \n\n"+text,Extra.HTML()) 
      } catch (error) {
        await ctx.reply(response + " " + "Error to Handle")
        console.log(error);
      } 
    } else {
      ctx.reply("To get the issues just send the command as describe in the example below: \n\n /getissues repository")
    }
  });

};
