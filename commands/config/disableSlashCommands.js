//possibly have args that determine groups of interactions to disable?
//would have the same args for enabling them as well

exports.run = async (client, message, args) => {
    
    await message.client.application.fetch();
    if (message.author.bot || message.author.id !== message.client.application.owner.id) {return;}

    await message.guild.commands.fetch()
        .then(commands => commands.forEach(command => {
            command.delete();
        }))
        .catch(console.error);

    await message.reply('Slash commands have been disabled!');
}