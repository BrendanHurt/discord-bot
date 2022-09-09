const voiceChecks = require("../../util/music/validateVoiceChannel");

exports.name = 'stop'

exports.run = (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    
    if (voiceChecks(message, queue) === false) { return; }

    queue.destroy();
    return void message.reply({content: '🛑 | Stopped the music player!'});
}