const pagifyQueue = require('../../util/music/pagifyQueue');

/**
 * Displays the currently playing track as well as all tracks in the queue,
 * and the length of all of the tracks.
 * @param {Client} client 
 * @param {Message} message 
 * @returns {Void}
 */
exports.run = (client, message) => {
    const queue = client.player.getQueue(message.guildId);
    if (!queue && queue.nowPlaying === undefined) {
        return void message.reply({content: '❌ | Queue is empty!'});
    }

    try {

        const pages = pagifyQueue(queue);

        for (page of pages) {
            void message.reply({content: page});
        }
        return;
        
    } catch(err) {
        console.error(err);
        return void message.reply({content: 'An error occured while getting the queue'});
    }
}