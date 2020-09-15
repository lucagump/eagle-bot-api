const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {
  telegrambot.hears('👤 New Member', async function (ctx) {
    try {
      const response = (await axios.get(app_domain + '/airtable/form')).data;
      if (response.status == 'fail'){
        return ctx.reply("I can't find the link, sorry :(") 
      }
      await ctx.reply('Click on the <i>link</i> and fill the <b>Form</b> \n\n' + response.data, Extra.HTML()) 
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  });
};
