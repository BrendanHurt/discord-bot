exports.name = 'shuffle';

exports.run = (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    if (!queue) {
        return void message.reply('❌ | Queue is empty!');
    }
    queue.shuffle();
    return void message.reply('✅ | Queue has been shuffled!');
}