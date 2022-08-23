/**
 * Creates an array of stings that hold the name and length of all the tracks in
 * the queue. Pagifying is necessary to stay within the 2000 character limit of discord messages.
 * 
 * @param  {queue}  queue The queue holding the track names & durations to be pagified
 * @return {Array{string}} The pages of the queue
 * 
 * @todo Consider removing the currently playing track from the message
 * @todo Consider adding a limit so pages can be shorter if desired
 */
module.exports = pagifyQueue = (queue) => {
    let pages = [];
    let currPage = '';

    //no music playing
    if (queue.nowPlaying() === undefined) {
        pages.push('❌ | No music is playing!');
        return pages;
    }

    currPage = `🎶 | Now Playing:\n ${queue.nowPlaying().title} (${queue.nowPlaying().duration})\n⏱ | Queue:\n`;

    if (queue.tracks.length === 0) {
        currPage += 'Queue is empty!';
    }

    queue.tracks.forEach(track => {
        let entry = `${track.title} (${track.duration})\n`;

        //create a page if the message is too long
        if (currPage.length + entry.length >= 2000) {
            pages.push(currPage);
            currPage = '';
        }
        currPage += entry;
    });

    //get the last (or only) page
    pages.push(currPage);

    return pages;
}