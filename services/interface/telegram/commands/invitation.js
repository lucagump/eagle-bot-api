const moment = require('moment');
const startTime = moment();
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {
  telegrambot.hears('Uptime🏁', function (ctx) {
    ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
    ctx.reply("Uptime: "+ startTime.from(moment(), true));
  });
};
