const Telegraf = require('telegraf');
const requireAll = require('require-all');

const BOT_COMMANDS = requireAll({ dirname: `${__dirname}/commands` });
console.log(BOT_COMMANDS)
// 
// .___        __                 _____                     
// |   | _____/  |_  ____________/ ____\____    ____  ____  
// |   |/    \   __\/ __ \_  __ \   __\\__  \ _/ ___\/ __ \ 
// |   |   |  \  | \  ___/|  | \/|  |   / __ \\  \__\  ___/ 
// |___|___|  /__|  \___  >__|   |__|  (____  /\___  >___  >
//          \/          \/                  \/     \/    \/ 
// 

const token = '1225404853:AAHj66gyJMvEygjmXIyAdewtcRR0g37UHxo' // process.env.TELEGRAM_TOKEN;
const telegrambot = new Telegraf(token)

telegrambot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const response_time = new Date() - start
  console.log(`(Response Time: ${response_time})`)
})

telegrambot.launch();

Object.keys(BOT_COMMANDS).forEach(command => BOT_COMMANDS[command](telegrambot));

// (async function init() {
//   await Promise.all([
//     telegrambot.telegram.setWebHook(process.env.NODE_ENV === 'production' ? `https://eagle-bot-api.herokuapp.com/${token}` : '')
//   ]);
// })();
