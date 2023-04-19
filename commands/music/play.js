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

    const commandArgs = playArgHandler(message, args);
    const channel = message.member.voice.channel;
    const player = client.player;

    /////////////////////////////////////////////////////////////////////////
    //searching for a track
    //console.log(`Query: ${commandArgs.query}\nLimit: ${commandArgs.limit}`);
    await message.deferReply();
    const searchResult = await player.search(commandArgs.query, {
        requestedBy: (!isInteraction(message)) ? message.author.username : message.user.username,
        fallbackSearchEngine: `youtube`
    })
        .then()
        .catch((error) => {
            console.error(error);
            console.log('error while searching for the given query');
    });

    if (!searchResult || !searchResult.hasTracks()) {
        return void message.reply({content: 'No results were found!', ephemeral: true});
    }
    try {
        const { track } = await player.play(channel, searchResult, {
            nodeOptions: {
                metadata: message,
                skipOnNoStream: true,
            }
        });
        return message.followUp(`Added **${track.title}** to the queue!`);

    } catch(error) {
        message.editReply("Something went wrong while playing the track!");
        console.error(error);
    }
}

/**
 * Combines the arguments into an object so 
 * @param {Message} message The message that prompted the command
 * @param {[[string]]} args The user-provided arguments in the form of an array of string arrays
 * @return {} An object holding the query, and playlist limit if provided
 */
function playArgHandler(message, args) {
    let commandArgs = {};

    //recombine the strings for the query (args[0]) if it was split
    commandArgs.query = (!isInteraction(message)) ? args[0].join(" ") : message.options.get("query").value;

    if (isInteraction(message)) {
        const limitVal = message.options.get(`limit`);
        console.log((limitVal !== null) ? `Limit set to ${limitVal}` : `No limit set`);
        commandArgs.limit = message.options.get("limit")?.value;
        return commandArgs;
    }

    //add the playlist limit (args[1]) if it's there
    if (args[1] !== undefined) {
        args[1].shift();
        commandArgs.limit = Number(args[1].shift());
    }
    return commandArgs;
}