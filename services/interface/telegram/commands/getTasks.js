const axios = require('axios')
const Extra = require('telegraf/extra')
const { MESSAGES } = require('../common');

module.exports = telegrambot => {
  telegrambot.hears('🔍 Get Tasks', async (ctx) => {
    await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  
    try {
      const response = (await axios.get(app_domain + '/process/users/'+ctx.from.id)).data;

      if (response.status == "fail") {
        return ctx.reply(MESSAGES.UNAUTHORIZED) 
      } 
      return ctx.reply('Select a <b>Group</b>', Extra.HTML().markup((m) =>
      m.inlineKeyboard([
        m.callbackButton(response.groups[0], response.groups[0]),
        m.callbackButton(response.groups[1], response.groups[1]),
      ])))  
    
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  });
};
