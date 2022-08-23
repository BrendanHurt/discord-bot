const { QueryType } = require('discord-player');
const channelChecksPass = require('../../util/voiceChannelChecks');

/** 
 * Adds the user's queried track or playlist to the queue.
 * @param {Client}      client              Interaction point w/ the Discord API.
 * @param {Interaction} interaction         The interaction that called this function.
 * @returns {void}
 */
exports.run = async (client, interaction) => {
    await interaction.deferReply();
    if (channelChecksPass(interaction) !== true) {return;}

    /////////////////////////////////////////////////////////////////////////
    //searching for a track

    const query = interaction.options.get('query').value;
    const searchResult = await client.player.search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO
    })
    .catch((error) => {
        console.error(error);
        return void interaction.followUp({content: 'Something went wrong while searching for your request!'});
    });

    if (!searchResult || !searchResult.tracks.length) {
        return void interaction.followUp({content: 'No results were found!'});
    }
    
    /////////////////////////////////////////////////////////////////////////
    //creating the queue & connecting to the voice channel
    const queue = client.player.createQueue(interaction.guild, {
        metadata: interaction.channel,
        autoSelfDeaf: true,
        leaveOnEnd: false,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 5000
    });

    try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch (error) {
        console.error(error);
        void client.player.deleteQueue(interaction.guildId);
        return void interaction.followUp({content: 'Could not join your voice channel!'});
    }

    /////////////////////////////////////////////////////////////////////////
    //adding the track(s) to the queue & playing
    await interaction.followUp({content: `⏱ | loading your ${searchResult.playlist ? "playlist" : "track"}...`});

    try {
        //queueEmpty has to be set here, otherwise adding a new track sets nowPlaying
        const queueEmpty = queue.nowPlaying() === undefined;
        const max = (interaction.options.get("result_limit") === null) ? searchResult.tracks.length : interaction.options.get("result_limit").value;

        //console.log(searchResult.tracks[0]); //remove later

        if (searchResult.playlist) {
            queue.addTracks(searchResult.tracks.slice(0, max));
        } else {
            queue.addTrack(searchResult.tracks[0]);
        }

        //put the if back in later coach
        /*if (queueEmpty) {
            await queue.play();
        }*/
        await queue.play();

        return void interaction.followUp({content: `**${searchResult.playlist ? 'playlist' : searchResult.tracks[0].title}** has been added to the queue!`});
    } catch (error) { 
        console.error(error);
        return void interaction.followUp({content: 'Something went wrong while trying to add your request to the queue!'});
    }
}