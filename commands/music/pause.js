const voiceChannelChecks = require("../../util/music/voiceChannelChecks");

exports.name = "pause";

exports.run = async (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    if (!queue || !queue.playing) {
        return void message.reply({content: '❌ | No music is playing!'});
    }

    const success = queue.setPaused(true);

    return void message.reply({content: success ? "The player has been paused!" : "Something went wrong!"});
}