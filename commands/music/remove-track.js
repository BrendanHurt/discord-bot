const voiceChecks = require("../../util/music/validateVoiceChannel");
const queueChecks = require("../../util/music/validateQueuePlaying");
const isInteraction = require("../../util/isInteraction");

exports.name = 'remove_track'

/**
 * Removes a track from the queue
 * @param {Client} client The client application for the bot
 * @param {Message} message The message that prompted this command
 * @param {*} args The array of arguments, should hold one int
 */
exports.run = (client, message, args) => {

    const trackNumber = (!isInteraction(message)) ? args[0][0] - 1 : message.options.get("position").value - 1;
    const queue = client.player.nodes.get(message.guildId);

    if (voiceChecks(message, queue) === false) { return; }
    if (queueChecks(message, queue) === false) { return; }

    //validate args for non-slash command calls
    if (!isInteraction(message) && args[0].length <= 0) {
        return void message.reply({content: '❌ | No track number was given!', ephemeral: true});
    }
    if (!isInteraction(message) && args[0].length > 1) {
        return void message.reply("More than one position given!");
    }
    if (!isInteraction(message) && isNaN(args[0][0])) {
        return void message.reply("Queue position provided isn't a number!");
    };
    //check for bounds
    if (trackNumber > queue.tracks.length) {
        return void message.reply({content: `❌ | ${trackNumber + 1} is past the end of the queue!`, ephemeral: true});
    }

    try {
        const track = queue.node.remove(queue.tracks.toArray()[trackNumber]);
        return void message.reply({content: `✅ | Removed track: **${track.title}** (${track.duration})`});
    } catch (error) {
        console.error(error);
        return void message.reply({
            content: `Something went wrong while trying to remove track number: ${trackNumber + 1} from the queue`
        });
    }
}