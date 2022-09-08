const { QueryType } = require('discord-player');
const voiceChecks = require("../../util/music/validateVoiceChannel");

exports.name = 'play';

/**
 * Searches for and queues a track or playlist from a given query
 * @param {Client} client The client application
 * @param {Message} message The message that prompted this command
 * @param {Array[query: string, result_limit: int]} args Arguments for making the query (only needed if 
 *      called by a non-slash command).
 * @returns {Void}
 * 
 * @TODO Add input sanitization & validation
 */
exports.run = async (client, message, args) => {

    if (voiceChecks(message) === false) { return; }

    /////////////////////////////////////////////////////////////////////////
    //searching for a track
    const player = client.player;
    const query = (!message.commandName) ? args[0] : message.options.get("query").value;
    let max = (!message.commandName) ? args[1] : message.options.get("result_limit")?.value;

    const searchResult = await player.search(query, {
        requestedBy: (message.commandName) ? message.user : message.author.username,
        searchEngine: QueryType.AUTO
    })
    .catch(() => {console.log('error while searching for the given query')});

    if (!searchResult || !searchResult.tracks.length) {
        return void message.reply({content: 'No results were found!', ephemeral: true});
    }

    /////////////////////////////////////////////////////////////////////////
    //creating the queue & connecting
    const queue = player.createQueue(message.guild, {
        metadata: message.channel,
        leaveOnEnd: false
    });
    if (!queue.connection) {
        await queue.connect(message.member.voice.channel)
            .catch((error) => {
                console.error(error);
                void player.deleteQueue(message.guildId);
                return void message.reply({content: 'Could not join your voice channel!', ephemeral: true});
            });
    }

    /////////////////////////////////////////////////////////////////////////
    //adding the track, or tracks, to the queue
    try {

        if (!max || max > searchResult.tracks.length) { max = searchResult.tracks.length; }

        if (searchResult.playlist) {
            for (let i = 0; i < max; i++) {
                setTimeout(function() {}, 2000);
                queue.addTrack(searchResult.tracks[i]);
            }
        } else {
            queue.addTrack(searchResult.tracks[0]);
        }

        if (!queue.playing) { 
            await queue.play()
                .then()
                .catch("wuh oh");
        }

        message.reply({content: `⏱ | loading your ${searchResult.playlist ? "playlist" : "track"}...`});

    } catch (error) {
        console.error(error);
        message.reply({content: 'Something went wrong while trying to queue the request', ephemeral: true});
    }
}