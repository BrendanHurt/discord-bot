exports.name = 'shuffle';

exports.run = (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    if (!queue) {
        return void message.channel.send('❌ | Queue is empty!');
    }
    queue.shuffle();
    return void message.channel.send('✅ | Queue has been shuffled!');
}