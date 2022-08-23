const channelChecksPass = require('../../util/voiceChannelChecks');

exports.run = async (client, interaction) => {
    await interaction.deferReply();
    if (channelChecksPass(interaction) !== true) {return;}
    
    const trackNumber = interaction.options.get("track_number").value - 1;
    const queue = client.player.getQueue(interaction.guildId);

    //check empty
    if (!queue) {
        return void interaction.followUp({content: '❌ | Queue is empty!'});
    }

    //check for bounds
    if (trackNumber > queue.tracks.length) {
        return void interaction.followUp({content: `❌ | ${trackNumber} is past the end of the queue!`})
    }

    try {
        trackTitle = queue.tracks[trackNumber].title;
        trackLength = queue.tracks[trackNumber].duration;
        queue.remove(queue.tracks[trackNumber]);
        return void interaction.followUp({content: `✅ | Removed track: **${trackTitle}** (${trackLength})`});
    } catch {
        return void interaction.followUp({
            content: `Something went wrong while trying to remove track number: ${trackNumber + 1} from the queue`
        });
    }
}