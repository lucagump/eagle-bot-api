const axios = require('axios')

const token = process.env.TELEGRAM_TOKEN
const url = "https://api.telegram.org/bot" + token 

async function sendMessage(req) {        
    try {
      const response = await axios.post(url+"/sendMessage", {
        chat_id: req.body.chat_id,  
        text: req.body.text  
      });
      return response.data
    } 
    catch(error) {
      console.log(error);
    }
  };

module.exports = {

  send: async function(req, res) {
      try {
          const message = await sendMessage(req)
          await res.status(200).send('Message "' + message + "sent!");
      } catch (error) {
          res.status(500).send('500 - Internal Server Error')
          console.log(error);
      }
  }
}

