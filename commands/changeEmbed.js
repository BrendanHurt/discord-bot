const {EmbedBuilder} = require('@discordjs/builders');

exports.run = async (client, message, args) => {
    if (client.embedMessage === undefined) {
        return void message.channel.reply({content: 'Embed hasn\'t been made yet!', ephemeral: true});
    }

    const newEmbed = new EmbedBuilder()
        .setTitle('Edited Embed')
        .setDescription('Now with new stuff!')

    client.embedMessage.edit({embeds: [newEmbed]});
}