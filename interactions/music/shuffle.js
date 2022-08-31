const channelChecksPass = require('../../util/voiceChannelChecks');

exports.run = async (client, interaction) => {
    require("../../commands/music/shuffle").run(client, interaction, null);
    /*await interaction.deferReply();
    if (channelChecksPass(interaction) !== true) {return;}
    
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
        return void interaction.followUp({content: '❌ | Queue is empty!'});
    }

    queue.shuffle();
    return void interaction.followUp({content: '✅ | Queue has been shuffled!'});*/
}