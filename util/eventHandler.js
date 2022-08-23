const fs = require('fs');

/**
 * Summary: Binds all events in the events directory with the 
 * @param {Client} client Client for interacting with the Discord API
 */
module.exports = (client) => {
    const files = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

    for (file of files) {
        const eventName = file.split('.')[0];
        const event = require(`../events/${file}`);

        //binds the global scope to command's this, and gives it client as it's first arg?
        client.on(eventName, event.bind(null, client));
    }
}