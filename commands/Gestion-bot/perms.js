const Discord = require('discord.js');

module.exports = {
    name: "perms",
    description: "Permet d'afficher les permissions du bot",
    category: "botcontrol",
    usage: ["perms"],
      run: async(client, message, args, commandName) => {


        if(!client.config.buyers.includes(message.author.id)) return message.channel.send(await client.lang(`perms.perm`))

        let perm_ticket = client.db.get(`perm_ticket.${message.guild.id}`)?.filter(role => message.guild.roles.cache.get(role))
        let perm_giveaway = client.db.get(`perm_giveaway.${message.guild.id}`)?.filter(role => message.guild.roles.cache.get(role))
        let perm_1 = client.db.get(`perm1.${message.guild.id}`)?.filter(role => message.guild.roles.cache.get(role))
        let perm_2 = client.db.get(`perm2.${message.guild.id}`)?.filter(role => message.guild.roles.cache.get(role))
        let perm_3 = client.db.get(`perm3.${message.guild.id}`)?.filter(role => message.guild.roles.cache.get(role))
        let perm_4 = client.db.get(`perm4.${message.guild.id}`)?.filter(role => message.guild.roles.cache.get(role))
        let perm_5 = client.db.get(`perm5.${message.guild.id}`)?.filter(role => message.guild.roles.cache.get(role))
        if (!perm_1) perm_1 = []
        if (!perm_2) perm_2 = []
        if (!perm_3) perm_3 = []
        if (!perm_4) perm_4 = []
        if (!perm_5) perm_5 = []
        if (!perm_ticket) perm_ticket = []
        if (!perm_giveaway) perm_giveaway = []
    

        let embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle("Permissions")
        .addFields(
            {name: "Permission 1", value: perm_1.length > 0 ? perm_1.map(r => `<@&${r}>`).join("\n") : "Aucune", inline: true},
            {name: "Permission 2", value: perm_2.length > 0 ? perm_2.map(r => `<@&${r}>`).join("\n") : "Aucune", inline: true},
            {name: "Permission 3", value: perm_3.length > 0 ? perm_3.map(r => `<@&${r}>`).join("\n") : "Aucune", inline: true},
            {name: "Permission 4", value: perm_4.length > 0 ? perm_4.map(r => `<@&${r}>`).join("\n") : "Aucune", inline: true},
            {name: "Permission 5", value: perm_5.length > 0 ? perm_5.map(r => `<@&${r}>`).join("\n") : "Aucune", inline: true},
            {name: "Ticket", value: perm_ticket.length > 0 ? perm_ticket.map(r => `<@&${r}>`).join("\n") : "Aucune", inline: true},
            {name: "Giveaway", value: perm_giveaway.length > 0 ? perm_giveaway.map(r => `<@&${r}>`).join("\n") : "Aucune", inline: true}
            )
        .setFooter(client.footer)


        message.channel.send({embeds : [embed]});

    }
}