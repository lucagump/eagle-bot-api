const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

module.exports = telegrambot => {

  // Telegram Bot Menu
  telegrambot.command('eaglebot', async ctx => {
    ctx.reply("Select an Action to start", Markup
      .keyboard([
        ['🚀 Tasks and Issues 🚀'], 
        ['👤 New Member',  'Add Collab 👨‍💻','Join Org🤝'],
        ['🤖 Bot Settings 🤖']
      ])
      .oneTime()
      .resize()
      .extra()
    )
  });

  // Task & Issues Menu
  telegrambot.hears('🚀 Tasks and Issues 🚀', async ctx => {
    await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
    try {
      await ctx.reply("Select an Action to start",Markup
        .keyboard([
          ['🏎🏁E-Agle Bot🏁🏎'], 
          ['🔍 Get Tasks', '⭐️ Assign 📢','New Issue 😎'], 
          ['👤 New Member',  'Add Collab 👨‍💻'],
          ['🤖 Bot Settings 🤖']
        ])
        .oneTime()
        .resize()
        .extra()
      )  
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  });

  // Alias in Menu to go back 
  telegrambot.hears('🏎🏁E-Agle Bot🏁🏎', async ctx => {
    await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
    ctx.reply("Select an Action to start", Markup
      .keyboard([
        ['🚀 Tasks and Issues 🚀'], 
        ['👤 New Member',  'Add Collab 👨‍💻','Join Org🤝'],
        ['🤖 Bot Settings 🤖']
      ])
      .oneTime()
      .resize()
      .extra()
    )
  });

  // Assign Task & Issues Menu
  telegrambot.hears('⭐️ Assign 📢', async ctx => {
    await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)

    try {
      await ctx.reply("Select an Action to start",Markup
        .keyboard([
          ['🚀 Tasks and Issues 🚀'], 
          ['⭐️ Assign Task', 'Assign Issue 😎'], 
          ['🤖 Bot Settings 🤖']
        ])
        .oneTime()
        .resize()
        .extra()
      )  
    
    } catch (error) {
      ctx.reply('<i>Error to Handle 😊</i>',Extra.HTML())
      console.log(error);
    }
  });

  // Settings Menu
  telegrambot.hears('🤖 Bot Settings 🤖', async ctx => {
    await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)

    ctx.reply("Select an Action to start",Markup
      .keyboard([
        ['🏎🏁E-Agle Bot🏁🏎'],
        ['🤖Authentication', 'Logout😴'], 
        ['Uptime🏁', 'Test🤘', 'Help👨‍💻'] 
      ])
      .oneTime()
      .resize()
      .extra()
    )
  });

  // Menu Create Issue/Task or both
  telegrambot.hears('New Issue 😎', async ctx => {
    await ctx.deleteMessage(ctx.from.chat_id, ctx.update.message.message_id)
  
    ctx.reply('Here we are! You can create a new issue or a new task as showed below, '+
    'you can do both using /problem \n\n'+
    '/newissue / title / description / repository \n' +
    '/newtask / title / description / group \n' +
    '/problem / title / description / repository / group \n\n' +
    '<i>Problems with Repositories and Groups? use /repositories and /groups 😊</i>',Extra.HTML())
  });
};
