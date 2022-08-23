const config = require("../config.json");

module.exports = (client, message) => {
    if (message.author.bot) {return;}
    if (message.content.indexOf(config.prefix) !== 0) {return;}

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) {return;}
    try {
        command.run(client, message, args);
    } catch(error) {
        console.error(error);
    }
}