const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Telegraf = require('telegraf');
const requireAll = require('require-all');

const BOT_COMMANDS = requireAll({ dirname: `${__dirname}/commands` });

if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error('You must provide TELEGRAM_BOT_TOKEN');
if (!process.env.MONGODB_URI) throw new Error('You must provide MONGODB_URI');
if (!process.env.PORT) throw new Error('You must provide PORT');

global.app_domain = "http://localhost:" + process.env.PORT; 
//global.app_domain = "https://eagle-cms.herokuapp.com";

app.use(bodyParser.json());
app.get(`/`, (req, res) => res.redirect('https://telegram.me/eagle-git-bot'));
app.post(`/${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  telegrambot.telegram.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(process.env.PORT, () => {
  console.log('Example app listening on port 3000!')
});                                    
            
app.use(telegrambot.webhookCallback('/secret-path'))

telegrambot.telegram.setWebhook('https://server.tld:8443/secret-path')
