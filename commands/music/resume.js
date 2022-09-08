const voiceChecks = require("../../util/music/validateVoiceChannel");
const queueChecks = require("../../util/music/validateQueuePlaying");

exports.name = "resume";

exports.run = async (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    
    if (voiceChecks(message, queue) === false) { return; }
    if (queueChecks(message, queue) === false) { return; }

    const success = queue.setPaused(false);

    return void message.reply({content: success ? "The player has resumed playing!" : "Something went wrong!"});
}