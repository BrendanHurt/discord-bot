const getInteractions = require('../util/getFiles');

module.exports = async (client, interaction) => {
    if (!interaction.isCommand()) {return;}

    const command = client.interactions.get(interaction.commandName);

    if (!command) {
        return void interaction.reply({content: 'Couldn\'t find that command!', ephemeral: true});
    }

    try {
        await command.run(client, interaction);
    } catch(error) { 
        console.error(error);
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
}