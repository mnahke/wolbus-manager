const Discord = require("discord.js")

module.exports = {
    name: "ping",
    description: "Affiche la latence du bot",
    permissions: "Aucune",

    async run(client, interaction) {
        interaction.reply(`Ping: **${client.ws.ping}**`)
    }
}