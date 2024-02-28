const Discord = require("discord.js")
const fs = require('fs');
const crypto = require('crypto');
const config = require("../../config")

module.exports = {
    name: "drop",
    description: "drop une key",
    permissions: "Aucune",

    async run(client, interaction) {
        const developerID = config.dev; 
        if (interaction.user.id !== developerID) {
            return
        }

        
        const key = crypto.randomBytes(16).toString('hex');

        
        const keyPath = 'key.txt';
        fs.writeFileSync(keyPath, key);

        
        interaction.reply(`clé : \`${key}\``);
    },
};