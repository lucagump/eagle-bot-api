const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

module.exports = telegrambot => {

telegrambot.action(/.+/, async (ctx) => {
    if(ctx.match[0] == "yes"){
      try {
        const response = (await axios.delete(app_domain + '/process/logout/' + ctx.from.id)).data;

        if ( response.status == "fail") {
          return ctx.reply("Your account is already unlinked") 
        }  
        
        return ctx.reply(MESSAGES.ACCOUNT_UNLINKED) 
      } catch (error) {
        console.log(error);
        ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      }
    } if (ctx.match[0] == "no") {
      return ctx.reply('It\'s fine <i>I\'m here</i> for you 😊',Extra.HTML())
    } else {
      try {
  
        const response = (await axios.get(app_domain + '/business/tasks/groups/'+ctx.match[0]+'/'+ctx.from.id)).data;
        if ( response.status == "fail") {
          return ctx.reply("Tasks from: " + ctx.match[0] + " not found sorry :(",Extra.HTML())          
        }

        var text = '';
        for (var i = 0; i < response.length; i++) {
            text += response[i].task + ' \n';
        }
        ctx.answerCbQuery(`Check the Tasks in ${ctx.match[0]}!`)
        await ctx.reply("Here a list of yours <b>tasks</b> \n\n"+text,Extra.HTML()) 
      } catch (error) {
        console.log(error);
        ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      }
    }
  });

};
