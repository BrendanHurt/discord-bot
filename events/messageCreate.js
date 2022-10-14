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

/**
 * Parses the arguements from the input string. Identifies "groups" of arguments
 * based on keywords with a leading dash (-). Basically similar to how shells handle args.
 * @param {string} argString The argument string provided by the user
 * @return {[]} Returns an array that holds strings for individual arguments
 *  and arrays for argument groups
 */
function parseArgs(argString) {
    argGroups = argString.split(/ -+/g);
    args = [];
    //loop through argGroups & split by spaces
    for (const group of argGroups) {
        let arg = group.split(/ +/g);
        args.push(arg);
    }
    return args;
}