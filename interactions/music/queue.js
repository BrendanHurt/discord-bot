const channelChecksPass = require('../../util/voiceChannelChecks');

exports.name = 'queue';

/**Ideas for splitting queue into multiple responses if it's over 2000 characters
 * 1. Create each line as an "entry" that can be added to the queue message
 * 
 * 2. If adding the entry would make the length of the message beyond 2000 
 * characters, then push the current message onto an array, and start a new message.
 * 
 * 3. When all of the tracks in the queue have been added, loop over the array and
 * perform interaction followUps with each message as the content
 * 
 * 
 * Idea for later:
 * Add reactions to see next page or not
 * Could even try to use ephemeral messages to go up and down the queue?
 */

//TODO: move the pagification to it's own function in util

exports.run = async (client, interaction) => {
    await interaction.deferReply({ephemeral: true});
    if (channelChecksPass(interaction) !== true) {return;}
    
    const queue = client.player.getQueue(interaction.guildId);
    const charMax = 2000; //max number of characters in a discord message
    const queuePages = [];

    if (!queue.nowPlaying()) {
        return void interaction.followUp({content: 'No music is playing!'});
    }

    try {
        let queueOutput = `🎶 | Now Playing:\n ${queue.nowPlaying().title} (${queue.nowPlaying().duration})\n⏱ | Queue: `;

        if (queue.tracks.length === 0) {
            queueOutput += '\nThe queue is empty!';
        }

        for (let i = 0; i < queue.tracks.length; i++) {
            let entry = `\n **Track ${i + 1}:** ${queue.tracks[i].title} (${queue.tracks[i].duration})`;

            if (queueOutput.length + entry.length > charMax) {
                queuePages.push(queueOutput);
                queueOutput = "";
            }

            queueOutput += entry;
        }

        //add the last page (or only one if it hasn't hit charMax)
        queuePages.push(queueOutput);
        
        for (const page of queuePages) {
            void interaction.followUp({content: page, ephemeral: true});
        }
        return;
    } catch(err) {
        console.error(err);
        return void interaction.followUp({content: 'An error occured while getting the queue'});
    }
}