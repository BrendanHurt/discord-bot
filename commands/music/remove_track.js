exports.name = 'remove_track'

exports.run = (client, message, args) => {
    if (!message.commandName && args.length <= 0 
            || message.commandName && message.options.get("position") === null) {
        return void message.reply({content: '❌ | No track number was given!'});
    }


    const trackNumber = (!message.commandName) ? args[0] - 1 : message.options.get("position").value - 1;
    const queue = client.player.getQueue(message.guildId);

    //check empty
    if (!queue) {
        return void message.reply({content: '❌ | Queue is empty!'});
    }

    //check for bounds
    if (trackNumber > queue.tracks.length) {
        return void message.reply({content: `❌ | ${trackNumber} is past the end of the queue!`})
    }

    try {
        const track = queue.remove(queue.tracks[trackNumber]);
        return void message.reply({content: `✅ | Removed track: **${track.title}** (${track.duration})`});
    } catch (error) {
        console.error(error);
        return void message.reply({
            content: `Something went wrong while trying to remove track number: ${trackNumber + 1} from the queue`
        });
    }
}