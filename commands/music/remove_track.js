exports.name = 'remove_track'

exports.run = (client, message, args) => {
    if (args.length <= 0) {
        return void message.channel.send({content: '❌ | No track number was given!'});
    }

    const trackNumber = args[0] - 1;
    const queue = client.player.getQueue(message.guildId);

    //check empty
    if (!queue) {
        return void message.channel.send({content: '❌ | Queue is empty!'});
    }

    //check for bounds
    if (trackNumber > queue.tracks.length) {
        return void message.channel.send({content: `❌ | ${trackNumber} is past the end of the queue!`})
    }

    try {
        const track = queue.remove(queue.tracks[trackNumber]);
        return void message.channel.send({content: `✅ | Removed track: **${track.title}** (${track.duration})`});
    } catch (error) {
        console.error(error);
        return void message.channel.send({
            content: `Something went wrong while trying to remove track number: ${trackNumber + 1} from the queue`
        });
    }
}