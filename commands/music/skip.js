exports.name = 'skip';

exports.run = async (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    if (!queue || queue.nowPlaying() === undefined) {
        return void message.reply({content: '❌ | No music is playing!'});
    }
    const currentTrack = queue.nowPlaying().title;
    const success = queue.skip();

    return void message.reply({
        content: success ? `✅ | Skipped **${currentTrack}!**` : `❌ | Something went wrong!`
    });
}