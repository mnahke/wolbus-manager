module.exports = {
    name: 'messageCreate',
    once: false,
    run(message, bot) {
        if (message.author.bot) return;

        const prefix = '!';
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = bot.commands.get(commandName);
        if (!command) return;

        try {
            command.run(bot, message, args);
        } catch (error) {
            console.log(error);
        }
    },
};