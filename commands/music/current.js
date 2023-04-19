const voiceChecks = require("../../util/music/validateVoiceChannel");
const queueChecks = require("../../util/music/validateQueuePlaying");

const { EmbedBuilder } = require("discord.js");
exports.aliases = ['nowPlaying'];

exports.run = (client, message, args) => {
    const queue = client.player.nodes.get(message.guildId);
    
    if (voiceChecks(message, queue) === false) { return; }
    if (queueChecks(message, queue) === false) { return; }

    const track = queue.currentTrack;

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Now Playing')
        .setThumbnail(track.setThumbnail)
        .addFields({name: "Track Title:", value: track.title, inline: true})
        .addFields({name: "Track Length", value: track.duration, inline: true});

    return void message.reply({embeds: [embed]});
};