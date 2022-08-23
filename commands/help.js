/*
Ideas:
1. Just print out all the commands & descriptions (pagifying when necessary)
2. Have no args print out all the commands, and args to get descriptions of specific commands
    - so you could use !help to get the list of commands
    - then use !help <command>, ..., <command> to get the descriptions of the given commands
3. Link to the documentation site when I make one.

just printing out all the commands for now
*/

exports.run = (client, message, args) => {
    let reponseMessage = 'Here\'s the list of commands:\n';
    const commands = [...client.commands.keys()];
    for (command of commands) {
        reponseMessage += `${command}\n`;
    }
    return void message.channel.send(reponseMessage);
}