const axios = require('axios');
const Extra = require('telegraf/extra');
const { MESSAGES } = require('../common');

async function getMember(ctx,username){
  try {
    const response = await axios.get(app_domain + '/business/groups/members/'+username,{
      data:{
        userID: ctx.from.id
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
    if (username == null){
      try {

        const response = (await axios.get(app_domain + '/business/groups/members',{
          data:{
            userID: ctx.from.id
          }
        })).data;
        
        if(response.status == "fail"){
          return ctx.reply("I can't find the members, sorry :(\n" + response.errorMessage,Extra.HTML())
        }
        
        var data = response.data.data

        for (var i = 0; i < data.length; i++) {
            text += data[i].name + ' - tasks: ' + data[i].tasks.length +' \n';
        }
        
        return ctx.reply("Here the Members list \n\n"+text,Extra.HTML()) 
      } catch (error) {
        console.log(error);
        ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      }
    } else {
      try {
        const response = (await axios.get(app_domain + '/business/groups/members/' + username,{
          data:{
            userID: ctx.from.id
          }
        })).data;
        
        if(response.status == "fail"){
          return ctx.reply(username + " is not a member, sorry")
        }
        var data = response.data.data
        text += '' + data.name + ' tasks: ' + data.tasks.length +' \n';
        
        return ctx.reply("Here " + username+ "! \n\n" + text,Extra.HTML()) 
    

      } catch (error) {
        console.log(error);
        if( error.response.data.statusCode == 404 )  {
          return ctx.reply('<i>I can\'t find the User 😊</i>'+username,Extra.HTML())
        }
        ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      }
    }
  });

};
