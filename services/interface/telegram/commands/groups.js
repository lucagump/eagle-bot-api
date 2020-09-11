const axios = require('axios')
const Extra = require('telegraf/extra')
const { MESSAGES } = require('../common');

async function getGroups(msg){
  try {
    const response = await axios.get(app_domain + '/actions/users/'+msg.from.id);
    return response.data
  } catch (error) {
    return error
  }
} 

module.exports = telegrambot => {
  telegrambot.command('groups', async (ctx) => {
    try {
      const response = await getGroups(ctx)
      return ctx.reply('Here are yours Groups: \n\n' + response.groups[0] + "\n" + response.groups[1], Extra.HTML)
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  });
};
