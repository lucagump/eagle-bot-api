const axios = require('axios')
const Extra = require('telegraf/extra')
const { MESSAGES } = require('../common');

module.exports = telegrambot => {

  telegrambot.command('getissues', async function (ctx) {
    var repository = null;
    
    var inputData = ctx.update.message.text.split(" ")
    console.log(inputData.length)
    
    if (inputData.length > 1 ) {
      repository = inputData[1];
      
      try {
        const response = (await axios.get(app_domain + '/business/issues/'+repository,{
          data:{
            'userID': (ctx.from.id).toString()
          }
        })).data;

        if( response.status == 'fail'){
          return ctx.reply("Can't find the <b>repository</b> \n\n"+text,Extra.HTML()) 
        }
        var text = '';
        var data = response.data 
        data.forEach(element => {
          text += '> ' + element.title + ' \n';
        });
        
        await ctx.reply("Here a list of yours <b>issues</b> \n\n"+text,Extra.HTML()) 
      } catch (error) {
        console.log(error);
        if( error.response.data.statusCode == 404 )  {
          return ctx.reply('<i>I can\'t find the Repository </i> '+ repository,Extra.HTML())
        }
        ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      } 
    } else {
      ctx.reply("To get the issues just send the command as describe in the example below: \n\n /getissues repository")
    }
  });

};
