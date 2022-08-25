const channelChecksPass = require('../../util/voiceChannelChecks');
const {EmbedBuilder} = require("discord.js");

exports.run = async (client, interaction) => {
    await interaction.deferReply();
    if (channelChecksPass(interaction) !== true) {return;}
    
    const queue = client.player.getQueue(interaction.guildId);
    
    if (!queue || queue.nowPlaying() === undefined) {
        return void interaction.followUp({content: '❌ | Not playing anything right now!'});
    }

    const track = queue.nowPlaying();

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Now Playing')
        .setThumbnail(track.setThumbnail)
        .addFields({name: "Track Title:", value: track.title, inline: true})
        .addFields({name: "Track Length", value: track.duration, inline: true});
    

    return void interaction.followUp({embeds: [embed]});
    
}