const { Client, Collection } = require('discord.js');
const xyla = new Client({ intents: 3276799 });

xyla.commands = new Collection();
xyla.setMaxListeners(0);
xyla.aliases = new Collection()

module.exports = xyla;