const fs = require('fs');
const Discord = require('discord.js');
const xyla = require("../client")

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

module.exports = async (client, interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const command = client.commands.get(interaction.commandName);
        if (command) {
            command.run(client, interaction, interaction.options);
        } else {
            console.log(`Commande non trouvée: ${interaction.commandName}`);
        }
    }  if (interaction.isSelectMenu()) {
        const botInfo = getBotInfo();
        const userBots = botInfo[interaction.user.id] || [];

        if (userBots.length === 0) {
            return interaction.reply("Vous n'avez aucun bot enregistré.");
        }

        let description = "";
        let title = "";
        
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

            description += `┖ Etat :** \`${etat}\`\n**┖ Expiration :** ${expirationText}**\n\n`;
            title += `Gestion du Bot - ${tag}`;
        }

        const embed = new Discord.EmbedBuilder()
            embed.setTitle(title)
            .setColor("White")
            embed.setDescription(description);
    
    

            const startButton = new Discord.ButtonBuilder()
                .setCustomId('start_')
                .setLabel('Start')
                .setStyle(Discord.ButtonStyle.Secondary);
    
            const stopButton = new Discord.ButtonBuilder()
                .setCustomId('stop_')
                .setLabel('Stop')
                .setStyle(Discord.ButtonStyle.Danger);
    
            const restartButton = new Discord.ButtonBuilder()
                .setCustomId('restart_')
                .setLabel('Restart')
                .setStyle(Discord.ButtonStyle.Success);
    
            
            const actionRow = new Discord.ActionRowBuilder()
                .addComponents(startButton, stopButton, restartButton);
                const collectorFilter = (i) => i.customId === 'start_' || i.customId === 'stop_' || i.customId === 'restart_';
                const buttonCollector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter });

buttonCollector.on('collect', async (collectedInteraction) => {
    if (collectedInteraction.customId === 'start_') {
        await collectedInteraction.reply("Chargement en cours...");

        const dynamicBotId = collectedInteraction.user.id;

        try {
            const botInfo = JSON.parse(fs.readFileSync('botinfo.json', 'utf8'))[dynamicBotId];

            if (botInfo) {
                if (!xyla.user || !xyla.user.id) {
                    await xyla.login(botInfo[0].token);
                    collectedInteraction.followUp(`Bot lancé avec succès !`);
                } else {
                    collectedInteraction.followUp(`Le bot est déjà en ligne.`);
                }
            }
        } catch (error) {
            console.error(error)
        }
    } else if (collectedInteraction.customId === 'stop_') {
        await collectedInteraction.reply("Chargement en cours...");
    
        const dynamicBotId = collectedInteraction.user.id;
    
        try {
            const botInfo = JSON.parse(fs.readFileSync('botinfo.json', 'utf8'))[dynamicBotId];

    
            if (botInfo) {
                if (xyla.user && xyla.user.id === botInfo[0].bot_id) {
                    console.log("Tentative d'arrêt du bot...");
    
                    if (xyla.user && xyla.user.id) {
                        xyla.destroy();
                        console.log("Bot arrêté avec succès!");
                        collectedInteraction.followUp(`Bot arrêté avec succès !`);
                    } else {
                        console.log("Le bot est déjà déconnecté.");
                        collectedInteraction.followUp(`Le bot est déjà déconnecté.`);
                    }
                } else {}
            } else {}
        } catch (error) {
            console.error("Erreur lors de l'arrêt du bot :", error);
        }
    } else if (collectedInteraction.customId === 'restart_') {
        await collectedInteraction.reply("Chargement en cours...");
    
        const dynamicBotId = collectedInteraction.user.id;
    
        try {
            const botInfo = JSON.parse(fs.readFileSync('botinfo.json', 'utf8'))[dynamicBotId];
    
            console.log("BotInfo:", botInfo);
    
            if (botInfo) {
                if (xyla.user && xyla.user.id === botInfo[0].bot_id) {
                    console.log("redémarrage du bot...");
    
                    if (xyla.user && xyla.user.id) {
                        
                        await xyla.destroy();
                        
                        
                        await new Promise(resolve => setTimeout(resolve, 2000));
    
                        
                        await xyla.login(botInfo[0].token);
    
                        console.log("Bot redémarré avec succès!");
                        collectedInteraction.followUp(`Bot redémarré avec succès !`);
                    } else {
                        console.log("Le bot est déjà déconnecté.");
                        collectedInteraction.followUp(`Le bot est déjà déconnecté.`);
                    }
                } else {}
            } else {}
        } catch (error) {}
    }
});
                
            await interaction.reply({ embeds: [embed], components: [actionRow], ephemeral: true });
    }
}