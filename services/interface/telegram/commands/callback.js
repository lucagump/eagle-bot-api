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
    } 
    
    const response = (await axios.get(app_domain + '/process/users/'+ctx.from.id)).data;

    if (response.status == "fail") {
      return ctx.reply(MESSAGES.UNAUTHORIZED) 
    } 
    
    if (ctx.match[1] == response.data[0] || ctx.match[1] == response.data[1]) {
      try {
  
        const response = (await axios.get(app_domain + '/business/tasks/groups/'+ctx.match[0]+'/'+ctx.from.id)).data;
        if ( response.status == "fail") {
          return ctx.reply("Tasks from: " + ctx.match[0] + " not found sorry :(",Extra.HTML())          
        }

        var tasks = response.data

        var text = '';
        for (var i = 0; i < tasks.length; i++) {
            text += tasks[i].task + ' \n';
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
