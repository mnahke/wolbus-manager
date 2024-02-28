const { ActivityType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,
    run(bot) {
        console.clear()
        console.log("\x1b[36m---------Client---------\x1b[0m"); // Couleur cyan
        console.log(`\x1b[32mBot ${bot.user.tag} est prêt!\x1b[0m`); // Couleur verte
        console.log("\x1b[36m---------Manager---------\x1b[0m"); // Couleur cyan    

        bot.user.setActivity("test 0.0.1", {
            type: ActivityType.Custom,
            url: "https://twitch.tv/emilioottv"
        });
    }
};