const voiceChecks = require("../../util/music/validateVoiceChannel");
const queueChecks = require("../../util/music/validateQueuePlaying");
const isInteraction = require("../../util/isInteraction");

/**
 * Creates an array of stings that hold the name and track length of all the tracks in
 * the queue. Paginating is necessary to stay within the 2000 character limit of discord messages.
 * 
 * @param  {queue}  queue The queue holding the track names & durations to be pagified
 * @return {string[]} The pages of the queue
 * 
 * @todo Consider removing the currently playing track from the message
 * @todo Consider adding a limit so pages can be shorter if desired
 */
 function paginateQueue(queue) {
    let pages = [];
    let currPage = '';

    //no music playing
    if (!queue.playing) {
        pages.push('❌ | No music is playing!');
        return pages;
    }

    currPage = `🎶 | Now Playing:\n ${queue.nowPlaying().title} (${queue.nowPlaying().duration})\n⏱ | Queue:\n`;

    if (queue.tracks.length === 0) {
        currPage += 'Queue is empty!';
    }

    let position = 1;
    queue.tracks.forEach(track => {
        let entry = `${position}: ${track.title} (${track.duration})\n`;

        //create a page if the message is too long
        if (currPage.length + entry.length >= 2000) {
            pages.push(currPage);
            currPage = '';
        }
        currPage += entry;
        position++;
    });

    //get the last (or only) page
    pages.push(currPage);

    return pages;
}

/**
 * Displays the currently playing track as well as all tracks in the queue,
 * and the length of all of the tracks.
 * @param {Client} client 
 * @param {Message} message 
 * @returns {Void}
 */
exports.run = async (client, message) => {
    const queue = client.player.getQueue(message.guildId);
    //const isInteraction = (message.commandName !== undefined);

    if (voiceChecks(message, queue) === false) { return; }
    if (queueChecks(message, queue) === false) { return; }

    if (isInteraction) { await message.deferReply(); }

    try {

        const pages = paginateQueue(queue);

        for (page of pages) {
            if (isInteraction) {
                message.followUp({content: page});
            } else {
                message.reply({content: page});
            }
        }
        return;
        
    } catch(error) {
        console.error(error);
        return void message.reply({content: 'An error occured while getting the queue'});
    }
}