const Discord = require("discord.js");
const { ActivityType } = require("discord.js");

module.exports = {
    name: "ready",
    run: async (client) => {
       
 setInterval(() => { 
        const status = client.db.get('nomstatut');
        const custom = client.db.get('type');
        const presence = client.db.get('presence');

        let activityType;
        if (custom === "STREAMING") {
            activityType = 1;
        } else if (custom === "WATCHING") {
            activityType = 3;
        } else if (custom === "PLAYING") {
            activityType = 0;
        } else if (custom === "LISTENING") {
            activityType = 2;
        }

        const presenceOptions = {
            status: presence || 'dnd',
            activities: [{
                name: status || "Gestion " + client.version,
                type: activityType || 1,
                url: "https://twitch.tv/NinaBot"

            }]};
             client.user.setPresence(presenceOptions)
        
    }, 5000)
    }
};
