//TODO: add no-no word detection
//TODO: add string validation to the args

exports.aliases = ['changePrefix', 'newPrefix'];

exports.run = (client, message, args) => {
    if (!args) {
        return void message.channel.send('❌ | No prefix provided!');
    }

    //add checking n shit later
    client.config.prefix = args[0];
    return void message.reply(`Command prefix changed to: ${args[0]}`);
}