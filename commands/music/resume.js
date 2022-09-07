exports.name = "resume";

exports.run = async (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    if (!queue || !queue.playing) {
        return void message.reply({content: '❌ | No music is playing!'});
    }

    const success = queue.setPaused(false);

    return void message.reply({content: success ? "The player has resumed playing!" : "Something went wrong!"});
}