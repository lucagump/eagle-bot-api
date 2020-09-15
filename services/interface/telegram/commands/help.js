const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {
    telegrambot.hears('Help👨‍💻', function (ctx) {
        ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
        ctx.reply(MESSAGES.HELP);
    });
};
