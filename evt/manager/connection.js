const axios = require("axios");
module.exports = {
    name: "ready",
    run: async (client) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/start`, { bot: client.user.id });
        } catch (error) {
            console.error("Manager Error:", error.data ? erreur.data : 'Manager Hors ligne !');
        }
    }
};
