const Discord = require('discord.js')
const intents = new Discord.IntentsBitField(3276799)
const client = new Discord.Client({intents})
const events = require('./Handlers/Events')
const config = require('./config')
const Commands = require('./Handlers/Commands')
const fs = require("fs")
const path = require("path")
const xyla = require("./client")

const botInfoFile = './botInfo.json';
const activeBots = [];

function getBotInfo() {
    try {
        const data = fs.readFileSync(botInfoFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier botInfoFile :', error.message);
        return {};
    }
}

const botInfo = getBotInfo();

for (const userBots of Object.values(botInfo)) {
    for (const userBot of userBots) {
        const { bot_id, temps, token } = userBot;

        console.log(`temps actuel : ${Date.now()}`);
        console.log(`temps d'activation : ${temps}`);
        if (temps > Date.now()) {
            console.log(`id du bot ${bot_id}`);
            fs.readdirSync(path.join(__dirname, './commands/')).forEach(dirs => {
                const commands = fs.readdirSync(path.join(__dirname, `./commands/${dirs}/`)).filter(files => files.endsWith(".js"));

                for (const file of commands) {
                    const getFileName = require(path.join(__dirname, `./commands/${dirs}/${file}`));
                    xyla.commands.set(getFileName.name, getFileName);
                }
            });

            fs.readdirSync(path.join(__dirname, './evt/')).forEach(dirs => {
                const events = fs.readdirSync(path.join(__dirname, `./evt/${dirs}`)).filter(files => files.endsWith(".js"));

                for (const event of events) {
                    const evt = require(path.join(__dirname, `./evt/${dirs}/${event}`));
                    if (evt.once) {
                        xyla.once(evt.name, (...args) => evt.run(...args, xyla));
                    } else {
                        xyla.on(evt.name, (...args) => evt.run(...args, xyla));
                    }
                }
            });

            const activationTimeRemaining = temps - Date.now();
            console.log(`Temps d'activation restant pour le bot '${bot_id}': ${activationTimeRemaining} ms`);

            if (activationTimeRemaining > 0) {
                if (!activeBots.some(bot => bot.user.id === bot_id)) {
                    xyla.login(token)
                        .then(() => {
                            console.log(`Le bot ${xyla.user.username} a été activé avec succès`);
                            activeBots.push(xyla);
                        })
                        .catch(error => {
                            if (error.message.includes("Invalid token")) {
                                console.log(`Erreur lors de l'activation du bot '${bot_id}' : Token invalide`);
                            } else {
                                console.log(`Erreur lors de l'activation du bot '${bot_id}' :`, error);
                            }
                        });
                } else {
                    console.log(`Le bot '${bot_id}' est déjà actif, pas besoin de relancer`);
                }
            } else {
                console.log(`Le temps d'activation pour le bot '${bot_id}' a expiré`);
            }
        } else {
            console.log(`Le temps d'activation pour le bot '${bot_id}' a expiré`);
        }
    } 
}
client.commands = new Discord.Collection()
client.color = config.color;
client.snipeMap = new Map();

client.on('messageDelete', message => {
    client.snipeMap.set(message.channel.id, {
        content: message.content,
        author: message.author.tag,
        image: message.attachments.first() ? message.attachments.first().proxyURL : 'Aucun'
    });
});

client.login(config.token);
Commands(client)
events(client)

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----');
    console.log(promise);
    console.log('----- Reason -----');
    console.log(reason);
  });