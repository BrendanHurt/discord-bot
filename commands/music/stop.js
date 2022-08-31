exports.name = 'stop'

exports.run = (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    if (!queue && queue.nowPlaying() === undefined) {
        return void message.reply({content: '❌ | No music playing!'});
    }
    queue.destroy();
    return void message.reply({content: '🛑 | Stopped the music player!'});
}