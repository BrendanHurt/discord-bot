const voiceChecks = require("../../util/music/validateVoiceChannel");
const queueChecks = require("../../util/music/validateQueuePlaying");

exports.name = 'skip';

exports.run = async (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    
    if (voiceChecks(message, queue) === false) { return; }
    if (queueChecks(message, queue) === false) { return; }

    const currentTrack = queue.current;
    const success = queue.skip();

    return void message.reply({
        content: success ? `✅ | Skipped **${currentTrack}!**` : `❌ | Something went wrong!`
    });
}