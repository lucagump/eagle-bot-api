module.exports = {

    //Simple version, without validation or sanitation
    sendMessage: function(req, res) {
        bot.sendMessage(msg.from.id, "data");
        res.send('Greetings from the Auth method!');
    },
}