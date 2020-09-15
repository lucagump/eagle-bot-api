const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {
  telegrambot.command('grouprepositories', async function (ctx) {
    try {
      const response = (await axios.get(app_domain + '/process/repositories/'+ ctx.from.id)).data;
      
      if (response.status == "404") {
        return ctx.reply(MESSAGES.UNAUTHORIZED) 
      }     

      repositories = response.data;

      var text = '';
      for(var k in repositories) {
        text += "\n" +  k + '\n\n'; 
        repositories[k].forEach(function(element) {
          text += element + '\n'
        })    
      }
      await ctx.reply("Here a list of yours <b>Repositories</b> \n"+text,Extra.HTML()) 
    } catch (error) {
      console.log(error);
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
    }
  });
};
