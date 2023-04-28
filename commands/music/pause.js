const voiceChecks = require("../../util/music/validateVoiceChannel");
const queueChecks = require("../../util/music/validateQueuePlaying");
const { useMasterPlayer } = require("discord-player");

exports.name = "pause";

exports.run = async (client, message, args) => {
    const player = useMasterPlayer();
    const queue = player.nodes.get(message.guildId);

    if (voiceChecks(message, queue) === false) { return; }
    if (queueChecks(message, queue) === false) { return; }

    const success = queue.node.pause();

    return void message.reply({content: success ? "The player has been paused!" : "Something went wrong!"});
}