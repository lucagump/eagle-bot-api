const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {
  telegrambot.hears('Test🤘', function (ctx) {
    // ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
    ctx.reply( 
      "Hello "+ ctx.from.username + "\n"+
      "our Chat ID is: " + ctx.chat.id + 
      "\nyour Telegram ID is: " + ctx.from.id);
  });
};
