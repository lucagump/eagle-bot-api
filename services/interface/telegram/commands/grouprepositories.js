const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

async function getRepositoriesGroups(msg){
  try {
    const response = await axios.get(app_domain + '/actions/topics/repositories/'+ msg.from.id);
    return response.data
  } catch (error) {
    return error
  }
}

module.exports = telegrambot => {
  telegrambot.command('grouprepositories', async function (ctx) {
    try {
      const response = await getRepositoriesGroups(ctx)
      if (response.response.status == "404") {
        return ctx.reply(MESSAGES.UNAUTHORIZED) 
      }     
      var text = '';
      for(var k in response) {
        text += "\n" +  k + '\n\n'; 
        response[k].forEach(function(element) {
          text += element + '\n'
        })    
      }
      await ctx.reply("Here a list of yours <b>Repositories</b> \n"+text,Extra.HTML()) 
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  });
};
