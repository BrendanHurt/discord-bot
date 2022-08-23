const channelChecksPass = require('../../util/voiceChannelChecks');
//const {EmbedBuilder} = require('@discordjs/builders');


exports.run = async (client, interaction) => {
    await interaction.deferReply();
    if (channelChecksPass(interaction) !== true) {return;}
    
    const queue = client.player.getQueue(interaction.guildId);
    
    if (!queue || queue.nowPlaying() === undefined) {
        return void interaction.followUp({content: '❌ | Not playing anything right now!'});
    }

    return void interaction.followUp({content: `🎶 | Now Playing:\n ${queue.nowPlaying().title} (${queue.nowPlaying().duration})`});

    /*const embed = new EmbedBuilder()
        .setColor(0xFF0099)
        .setTitle('Now Playing')
        .setThumbnail(track.setThumbnail)
        .addFields({name: track.title, value: `Length: ${track.duration}`});
    

    client.embedMessage = await interaction.followUp({embeds: [embed.data]});
    return;
    */
}