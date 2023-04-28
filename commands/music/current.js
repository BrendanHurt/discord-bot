const voiceChecks = require("../../util/music/validateVoiceChannel");
const queueChecks = require("../../util/music/validateQueuePlaying");
const createPlayerEmbed = require(`../../embeds/createPlayerEmbed`);
const { useMasterPlayer } = require("discord-player");
exports.aliases = ['nowPlaying'];

exports.run = (client, message, args) => {
    const player = useMasterPlayer();
    const queue = player.nodes.get(message.guildId);
    
    if (voiceChecks(message, queue) === false) { return; }
    if (queueChecks(message, queue) === false) { return; }

    const track = queue.currentTrack;

    return void message.reply({embeds: [createPlayerEmbed(track)]});
};