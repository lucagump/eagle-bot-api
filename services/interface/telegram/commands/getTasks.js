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
  telegrambot.hears('🔍 Get Tasks', async (ctx) => {
    await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  
    try {
      const response = await getGroups(ctx)
      console.log(response)
      if (response.response.status == "404") {
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
