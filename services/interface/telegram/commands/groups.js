const axios = require('axios')
const Extra = require('telegraf/extra')
const { MESSAGES } = require('../common');

module.exports = telegrambot => {
  telegrambot.command('groups', async (ctx) => {
    try {

      const response = (await axios.get(app_domain + '/process/users/'+ctx.from.id)).data;

      if ( response.status == "fail") {
        return ctx.reply(MESSAGES.UNAUTHORIZED)          
      }
      console.log(response)
      return ctx.reply('Here are yours Groups: \n\n' + response.data.groups[0] + "\n" + response.data.groups[1], Extra.HTML)
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  });
};
