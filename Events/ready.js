const Discord = require("discord.js")

const SlashCommands = require("../Handlers/slashCommands")

const config = require("../config")

const { red, gray, cyan, magenta, green } = require("colors")

const { ActivityType } = require("discord.js")

module.exports = async client => {

await SlashCommands(client)

console.log(red.bold("——————————[Statistiques]——————————"))

console.log(gray(`Travail en ${process.version} sur ${process.platform} ${process.arch}`))

console.log(gray(`Mémoire : ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`))

console.log(`${cyan("Bot en ligne sur ") + magenta(client.user?.tag)}`)

console.log(`${cyan(new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }))} - ${green("Démarrage")}`)

  client.user.setStatus('dnd');

  console.log("--------->.<---------")

  console.log(`

\x1b[33m

  [ＭＡＤＥ]   [ＢＹ]   [FLEXY]  

\x1b[0m

`);

    client.user.setActivity("Manager 0.0.1", {

      type: ActivityType.Custom,

      url : "https://twitch.tv/emilioottv"

    });

    client.user.setStatus('dnd');

}