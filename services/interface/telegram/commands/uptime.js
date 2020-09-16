const axios = require('axios');
const moment = require('moment');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

const startTime = moment();

module.exports = telegrambot => {
  telegrambot.hears('Uptime🏁', function (ctx) {
    // ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
    ctx.reply("Uptime: "+ startTime.from(moment(), true));
  });
};
