exports.name = 'stop'

exports.run = (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    if (!queue && queue.nowPlaying() === undefined) {
        return void message.channel.send({content: '❌ | No music playing!'});
    }
    queue.destroy();
    return void message.channel.send({content: '🛑 | Stopped the music player!'});
}