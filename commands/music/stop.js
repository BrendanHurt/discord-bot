const { useMasterPlayer } = require("discord-player");
const voiceChecks = require("../../util/music/validateVoiceChannel");

exports.name = 'stop'

exports.run = (client, message, args) => {
    const player = useMasterPlayer();
    const queue = player.nodes.get(message.guildId);
    
    if (voiceChecks(message, queue) === false) { return; }

    queue.delete();
    return void message.reply({content: '🛑 | Stopped the music player!'});
}