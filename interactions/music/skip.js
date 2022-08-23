const channelChecksPass = require('../../util/voiceChannelChecks');

/**
 * Summary: Skips the currently playing song.
 * @param {Client} client                   Client for accessing the Discord API.
 * @param {Interaction} interaction         Interaction that called this.
 * @returns {void Interaction.followUp()}   On failure, returns a failure message.
 */
exports.run = async (client, interaction) => {
    await interaction.deferReply();
    if (channelChecksPass(interaction) !== true) {return;}
    
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue && !queue.nowPlaying()) {
        return void interaction.followUp({content: '❌ | No music is playing!'});
    }
    const currentTrack = queue.nowPlaying().title;
    const success = queue.skip();

    await queue.play();
    
    return void interaction.followUp({
        content: success ? `✅ | Skipped **${currentTrack}!**` : `❌ | Something went wrong!`
    });
}