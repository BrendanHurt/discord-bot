const channelChecksPass = require('../../util/voiceChannelChecks');

exports.run = async (client, interaction) => {
    require("../../commands/music/stop").run(client, interaction, null);
    /*await interaction.deferReply();
    if (channelChecksPass(interaction) !== true) {return;}

    const queue = client.player.getQueue(interaction.guildId);

    if (!queue && queue.nowPlaying() === undefined) {
        return void interaction.followUp({content: '❌ | No music playing!'});
    }
    queue.destroy();
    
    return void interaction.followUp({content: '🛑 | Stopped the music player!'});*/
}