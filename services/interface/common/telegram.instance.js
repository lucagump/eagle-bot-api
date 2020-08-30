// const telegrambot = require('node-telegram-bot-api');
const config = require('../../../config/config.json')

var token = process.env.TELEGRAM_TOKEN || config.telegram.token;

var bot = new telegrambot(token, { polling: true });

module.exports = bot