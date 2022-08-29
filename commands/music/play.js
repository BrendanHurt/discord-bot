const { QueryType } = require('discord-player');

exports.name = 'play';

/**
 * Searches for and queues a track or playlist from a given query
 * @param {Client} client The client application
 * @param {Message} message The message that prompted this command
 * @param {Array} args Arguments for making the query (only needed if 
 * called by a non-slash command). 
 *      Args[0]: string (query)
 *      Args[1]: int (result_limit)
 * @returns {Void}
 * 
 * @TODO Add input sanitization & validation
 */
exports.run = async (client, message, args) => {
    /////////////////////////////////////////////////////////////////////////
    //searching for a track

    const player = client.player;
    const query = (!message.commandName) ? args[0] : message.options.get("query").value;
    let max = (!message.commandName) ? args[1] : 
            (message.options.get("result_limit") !== null) ? message.options.get("result_limit").value : undefined;

    const searchResult = await player.search(query, {
        requestedBy: (message.commandName) ? message.user : message.author.username,
        searchEngine: QueryType.AUTO
    })
    .catch(() => {console.log('error while searching for the given query')});

    if (!searchResult || !searchResult.tracks.length) {
        return void message.reply({content: 'No results were found!'});
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
                return void message.reply({content: 'Could not join your voice channel!'});
            });
    }

    /////////////////////////////////////////////////////////////////////////
    //adding the track, or tracks, to the queue
    try {
        
        //queueEmpty has to be set here otherwise it'll be set to the new track
        const queueEmpty = queue.nowPlaying() === undefined;

        if (!max || max > searchResult.tracks.length) { max = searchResult.tracks.length; }

        if (searchResult.playlist) {
            for (let i = 0; i < max; i++) {
                setTimeout(function() {}, 2000);
                queue.addTrack(searchResult.tracks[i]);
            }
        } else {
            queue.addTrack(searchResult.tracks[0]);
        }

        if (queueEmpty) {await queue.play();}

        message.reply({content: `⏱ | loading your ${searchResult.playlist ? "playlist" : "track"}...`});

    } catch (error) {
        console.error(error);
        message.reply('Something went wrong while trying to queue the request');
    }
}