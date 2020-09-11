const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

async function getMembers(msg){
  try {
    const response = await axios.get(app_domain + '/actions/groups/members',{
      data:{
        userID: msg.from.id
      }
    });
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

async function getMember(msg,username){
  try {
    const response = await axios.get(app_domain + '/actions/groups/members/'+username,{
      data:{
        userID: msg.from.id
      }
    });
    return response.data
  } catch (error) {
    var errorMessage = "Something bad just happened! Check your Server " + error.status
    console.log(error)
    return errorMessage
  }
}

module.exports = telegrambot => {

  telegrambot.command('members', async (ctx) => {
    var username = null
    var text = ''
    var inputData = ctx.update.message.text.split(" ")
    
    if (inputData.length > 1 ) {
      username = inputData[1];
    }
    try {
      if (username == null){
        response = await getMembers(ctx)
        for (var i = 0; i < response.length; i++) {
            text += response[i].name + ' - tasks: ' + response[i].tasks.length +' \n';
        }
        await ctx.reply("Here the Members list \n\n"+text,Extra.HTML()) 
      } else {
        response = await getMember(ctx,username)
        if (response == null){
          return ctx.reply(username + " is not a member, sorry")
        }
        text += '' + response.name + ' tasks: ' + response.tasks.length +' \n';
        await ctx.reply("Here " + username+ "! \n\n" + text,Extra.HTML()) 
      }
  
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  });

};
