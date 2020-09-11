const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

async function logout(msg){
    try {
        const response = await axios.delete(app_domain + '/actions/users/' + msg.from.id);
        return response.data
    } catch (error) {
        var errorMessage = "Something bad just happened! Check your Server " + error.status
        console.log(error)
        return error
    }
}

async function getGroupTasks(msg){
    try {
        const response = await axios.get(app_domain + '/actions/tasks/groups/'+msg.match[0]+'/'+msg.from.id);
        return response.data
    } catch (error) {
        var errorMessage = "Something bad just happened! Check your Server " + error.status
        console.log(error)
        return errorMessage
    }
} 

module.exports = telegrambot => {

telegrambot.action(/.+/, async (ctx) => {
    if(ctx.match[0] == "yes"){
      try {
        const message = await logout(ctx)
        if ( message.response.status == "404") {
          return ctx.reply("Your account is already unlinked") 
        } 
        return ctx.reply(MESSAGES.ACCOUNT_UNLINKED) 
      } catch (error) {
        ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
        console.log(error);
      }
    } if (ctx.match[0] == "no") {
      return ctx.reply('It\'s fine <i>I\'m here</i> for you 😊',Extra.HTML())
    } else {
      try {
        const response = await getGroupTasks(ctx)
        var text = '';
        for (var i = 0; i < response.length; i++) {
            text += response[i].task + ' \n';
        }
        ctx.answerCbQuery(`Check the Tasks in ${ctx.match[0]}!`)
        await ctx.reply("Here a list of yours <b>tasks</b> \n\n"+text,Extra.HTML()) 
      } catch (error) {
        ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
        console.log(error);
      }
    }
  });

};
