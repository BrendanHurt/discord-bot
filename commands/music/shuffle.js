const voiceChecks = require("../../util/music/validateVoiceChannel");
const queueChecks = require("../../util/music/validateQueuePlaying");

exports.name = 'shuffle';

exports.run = (client, message, args) => {
    const queue = client.player.nodes.get(message.guildId);
    
    if (voiceChecks(message, queue) === false) { return; }
    if (queueChecks(message, queue) === false) { return; }
    
    queue.tracks.shuffle();
    return void message.reply('✅ | Queue has been shuffled!');
}