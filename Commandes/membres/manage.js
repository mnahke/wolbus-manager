const fs = require('fs');
const Discord = require("discord.js");

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
        return {};
    }
}

module.exports = {
    name: "manage",
    description: "manage vos bots",
    permissions: "Aucune",

    async run(client, interaction) {
        const botInfo = getBotInfo();
        const userBots = botInfo[interaction.user.id] || [];

        if (userBots.length === 0) {
            return interaction.reply("Vous n'avez aucun bot enregistré.");
        }

        const options = userBots.map((bot, index) => {
            const botUser = client.users.cache.get(bot.bot_id);
            const description = `État : ${bot.is_expired ? '❌ expiré' : '✅ actif'}`;
        
            if (bot.expiration) {
                description += ` | Expiration : ${bot.expiration}`;
            }
        
            return {
                label: botUser ? botUser.tag : "Bot inconnu",
                value: index.toString(),
                description: description,
            };
        });

        const selectMenu = new Discord.StringSelectMenuBuilder()
            .setCustomId('select_bot')
            .setPlaceholder('Choisissez un bot...')
            .addOptions(options);

       
        const row = new Discord.ActionRowBuilder().addComponents(selectMenu);

        const introEmbed = new Discord.EmbedBuilder()
            .setTitle('Gestion des Bots')
            .setDescription('Choisissez un bot à gérer :')
            .setColor("White");

        await interaction.reply({ embeds: [introEmbed], components: [row] });
    },
};