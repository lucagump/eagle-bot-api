const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

async function getAirtableLink(){
  try {
    const response = await axios.get(app_domain + '/airtable/form');
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

module.exports = telegrambot => {
  telegrambot.hears('👤 New Member', async function (ctx) {
    try {
      const message = await getAirtableLink()
      await ctx.reply('Click on the <i>link</i> and fill the <b>Form</b> \n\n' + message, Extra.HTML()) 
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  });
};
