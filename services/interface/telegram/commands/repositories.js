const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

async function getRepositories(msg){
  try {
    const response = await axios.get(app_domain + '/actions/repositories/'+msg.from.id);
    return response
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
} 

module.exports = telegrambot => {
  telegrambot.command('repositories', async function (ctx) {
    try {
      const response = (await getRepositories(ctx)).data
      var text = '';
      for (var i = 0; i < response.length; i++) {
          text += response[i] + ' \n';
      }
      await ctx.reply("Here a list of yours repositories \n\n"+text,Extra.HTML()) 
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
});
};
