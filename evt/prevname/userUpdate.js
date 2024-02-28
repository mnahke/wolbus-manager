const axios = require("axios");
module.exports = {
    name: "userUpdate",
    run: async (client, oldUser, newUser) => {
        if (oldUser.username !== newUser.username) {
            if (oldUser.bot) return;  
          const old_name = oldUser.username;
            const user_id = oldUser.id;
            try {
                await axios.post("http://" + client.config.panel + "/oldnames", {
                    user_id,
                    old_name,
                });
            } catch (error) {
                console.error("Erreur API Aethon : " + error);
            }
        }
    },
};
