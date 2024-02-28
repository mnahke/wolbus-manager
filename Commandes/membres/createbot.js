const { Client, Collection, IntentsBitField } = require("discord.js");
const Discord = require("discord.js")
const fs = require("fs");
const path = require('path');
const config = require("../../config")

const botInfoFile = 'botInfo.json';

function saveBotInfo(botInfo) {
    fs.writeFileSync(botInfoFile, JSON.stringify(botInfo, null, 2));
}

function getBotInfo() {
    try {
        const data = fs.readFileSync(botInfoFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading botInfoFile:', error.message);
        return {};
    }
}

function time(timeString) {
    const regex = /(\d+)([smhdwy])/;
    const matches = timeString.match(regex);

    if (!matches) return 0;

    const amount = parseInt(matches[1]);
    const unit = matches[2];

    switch (unit) {
        case 's': return amount * 1000; // secondes
        case 'm': return amount * 60 * 1000; // minutes
        case 'h': return amount * 60 * 60 * 1000; // heures
        case 'd': return amount * 24 * 60 * 60 * 1000; // jours
        case 'w': return amount * 7 * 24 * 60 * 60 * 1000; // semaines
        case 'y': return amount * 365 * 24 * 60 * 60 * 1000; // années
        default: return 0;
    }
}

module.exports = {
    name: "createbot",
    description: "crée un bot",
    permissions: "Aucune",
    options: [
        {
            type: "string",
            name: "key",
            description: "La clé pour créer un bot",
            required: true
        },
        {
            type: "string",
            name: "token",
            description: "Le token du bot à créer",
            required: true
        },
        {
            type: "string",
            name: "temps",
            description: "La durée d'activation du bot",
            required: true
        }
    ],

    async run(client, interaction) {
        const key = interaction.options.getString('key');
        const token = interaction.options.getString('token');
        const ownerID = interaction.user.id;
        const activationTimeStr = interaction.options.getString('temps');
        const activationTime = time(activationTimeStr) || 0;
        const owner = interaction.user

        const member = interaction.guild.members.cache.get(ownerID);
        const roleToAddId = config.role; 
        if (member) {
            await member.roles.add(roleToAddId);
            console.log(`Rôle ajouté avec succès à ${member.user.tag}`);
        }

        const keyPath = 'key.txt';
        const keyData = fs.readFileSync(keyPath, 'utf8').trim();

        if (key !== keyData) {
            return interaction.reply({content: 'Clé incorrecte.', ephemeral: true});
        }

        const intents = new IntentsBitField(3276799);
        const bot = new Client({ intents });
        bot.ownerID = ownerID;

        bot.commands = new Collection();
        fs.readdirSync(path.join(__dirname, '../../commands/')).forEach(dirs => {
            const commands = fs.readdirSync(path.join(__dirname, `../../commands/${dirs}/`)).filter(files => files.endsWith(".js"));

            for (const file of commands) {
                const getFileName = require(path.join(__dirname, `../../commands/${dirs}/${file}`));
                bot.commands.set(getFileName.name, getFileName);
            }
        });

        fs.readdirSync(path.join(__dirname, '../../evt/')).forEach(dirs => {
            const events = fs.readdirSync(path.join(__dirname, `../../evt/${dirs}`)).filter(files => files.endsWith(".js"));

            for (const event of events) {
                const evt = require(path.join(__dirname, `../../evt/${dirs}/${event}`));
                if (evt.once) {
                    bot.once(evt.name, (...args) => evt.run(...args, bot));
                } else {
                    bot.on(evt.name, (...args) => evt.run(...args, bot));
                }
            }
        });

        try {
            await bot.login(token);
        } catch (error) {
            console.log(error);
            return interaction.reply({content: 'Token invalide.', ephemeral: true});
        }

        
        const botInfo = getBotInfo();
        const userBots = botInfo[ownerID] || [];
        userBots.push({ bot_id: bot.user.id, temps: Date.now() + activationTime, token });
        botInfo[ownerID] = userBots;
        saveBotInfo(botInfo);

        interaction.reply({content: 'Le bot a été créé avec succès!', ephemeral: true});
        const embed = new Discord.EmbedBuilder()
                .setTitle('Informations sur le Bot')
                .setColor("White")
                .addFields([
                    { name: 'Nom du Bot', value: bot.user.username },
                    { name: "bot id", value: bot.user.id },
                    { name: 'owner id', value: owner.id },
                    { name: "owner name", value: owner.tag },
                    { name: 'prefix', value: '!' }
                ]);

            owner.send({ embeds: [embed] });
        console.log("Nouveau bot connecté");
    },
};