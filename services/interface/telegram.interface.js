var telegrambot = require('node-telegram-bot-api')
var schedule = require('node-schedule')
const config = require('../../config/config.json');

var token = config.telegram.token;

var bot = new telegrambot(token, { polling: true });

bot.onText(/\/test/, function (msg) {
    bot.sendMessage(msg.chat.id, "Hello from Telegram Interface");
});

let siteUrl;
bot.onText(/\/bookmark (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it, in which category?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Telemetria',
          callback_data: 'development'
        },{
          text: 'Volante',
          callback_data: 'music'
        },{
          text: 'Exporter',
          callback_data: 'cute-monkeys'
        }
      ]]
    }
  });
});

bot.on("callback_query", (callbackQuery) => {
    const message = callbackQuery.message;

    bot.sendMessage(message.chat.id,'Added new Reporisotiry!');
});

var scheduledMessage = schedule.scheduleJob('30 18 * * *', function () {});

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL).