const voiceChecks = require("../../util/music/validateVoiceChannel");
const queueChecks = require("../../util/music/validateQueuePlaying");

exports.name = "pause";

exports.run = async (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);

    if (voiceChecks(message, queue) === false) { return; }
    if (queueChecks(message, queue) === false) { return; }

    const success = queue.setPaused(true);

    return void message.reply({content: success ? "The player has been paused!" : "Something went wrong!"});
}