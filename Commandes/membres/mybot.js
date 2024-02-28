const fs = require('fs');
const Discord  = require("discord.js");

const botInfoFile = 'botInfo.json';

function saveBotInfo(botInfo) {
    fs.writeFileSync(botInfoFile, JSON.stringify(botInfo, null, 2));
}

function getBotInfo() {
    try {
        const data = fs.readFileSync(botInfoFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log('Error reading botInfoFile:', error.message);
        return [];
    }
}

module.exports = {
    name: "mybot",
    description: "Afficher vos bots",
    permissions: "Aucune",

    async run(client, interaction) {
        const botInfo = getBotInfo();
        const userBots = botInfo[interaction.user.id] || [];

        if (userBots.length === 0) {
            return interaction.reply("Vous n'avez aucun bot enregistré.");
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(`Vos bot(s)`)
            .setColor("White");

        let description = "";

        for (let i = 0; i < userBots.length; i++) {
            const bot = userBots[i];
            const botUser = await client.users.fetch(bot.bot_id);
            const tag = botUser.tag;
            const timestamp = Math.floor(bot.temps / 1000);
            const timeRemaining = bot.temps - Date.now();
            const seuilExpiration = 1000;
            const isExpired = timeRemaining < seuilExpiration;
            const expirationText = isExpired ? `<t:${timestamp}:R>` : `<t:${timestamp}:R>`;
            const etat = isExpired ? `❌ expiré` : `✅ actif`;

            description += `**${i + 1} -** [\`${tag}\`](https://discord.com/api/oauth2/authorize?client_id=${bot.bot_id}&permissions=8&scope=bot%20applications.commands)\n**┖ Etat :** \`${etat}\`\n**┖ Expiration :** ${expirationText}\n\n`;
        }

        embed.setDescription(description);
        interaction.reply({ embeds: [embed] });
    },
};