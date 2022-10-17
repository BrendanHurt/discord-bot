const { QueryType } = require('discord-player');
const voiceChecks = require("../../util/music/validateVoiceChannel");
const isInteraction = require("../../util/isInteraction");

exports.name = 'play';

/**
 * Searches for and queues a track or playlist from a given query
 * @param {Client} client The client application
 * @param {Message} message The message that prompted this command
 * @param {{string: query, number: result_limit}} args Arguments for making the query (only needed if 
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
    const query = (!isInteraction(message)) ? args[0] : message.options.get("query").value;
    let max = (!isInteraction(message)) ? args[1] : message.options.get("result_limit")?.value;

    const searchResult = await player.search(query, {
        requestedBy: (isInteraction(message)) ? message.user : message.author.username,
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
                .catch(console.error);
        }

        message.reply({content: `⏱ | loading your ${searchResult.playlist ? "playlist" : "track"}...`});

    } catch (error) {
        console.error(error);
        message.reply({content: 'Something went wrong while trying to queue the request', ephemeral: true});
    }
}

/**
 * Combines the arguments into an object so 
 * @param {Message} message The message that prompted the command, used for displaying error messages
 * @param {[[string]]} args The user-provided arguments in the form of an array of string arrays
 * @return {} An object holding the query, and playlist limit if provided
 */
function playArgHandler(message, args) {
    let commandArgs = {};

    //recombine the strings for the query (args[0]) if it was split
    commandArgs.query = args[0].join(" ");

    //add the playlist limit (args[1]) if it's there
    if (args[1] !== undefined) {
        args[1].shift();
        commandArgs.limit = args[1];
    }

    return commandArgs;
}