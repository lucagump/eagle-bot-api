const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {
  telegrambot.hears('Logout😴', async function (ctx) {
    await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  
    return ctx.reply('Are you sure?', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton(" Yes ", "yes"),
      m.callbackButton(" No ", "no"),
    ])))
  
  });
};
