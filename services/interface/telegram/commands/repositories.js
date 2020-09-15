const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

async function getRepositories(ctx){
  try {
    const response = await axios.get(app_domain + '/business/repositories/'+ctx.from.id);
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
      const response = (await axios.get(app_domain + '/business/repositories/'+ctx.from.id)).data;

      if(response.status == "fail"){
        return ctx.reply("I can't find your repositories, sorry :(",Extra.HTML())
      }
      var data = response.data
      var text = '';
      for (var i = 0; i < data.length; i++) {
          text += data[i] + ' \n';
      }

      return ctx.reply("Here a list of yours repositories: \n\n"+text,Extra.HTML()) 
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
});
};
