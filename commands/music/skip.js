exports.name = 'skip';

exports.run = async (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    if (!queue && queue.nowPlaying() === undefined) {
        return void message.channel.send({content: '❌ | No music is playing!'});
    }
    const currentTrack = queue.current;
    const success = queue.skip();
    await queue.play();
    return void message.channel.send({
        content: success ? `✅ | Skipped **${currentTrack}!**` : `❌ | Something went wrong!`
    });
}