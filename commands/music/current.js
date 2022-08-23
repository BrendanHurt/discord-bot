exports.aliases = ['nowPlaying'];

exports.run = (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    if (queue === undefined || queue.nowPlaying() === undefined) {
        return void message.reply({content: '❌ | Not playing music right now!'});
    }
    try {
        return void message.reply({content: `🎶 | Now Playing:\n ${queue.nowPlaying().title} (${queue.nowPlaying().duration})`});
    } catch(error) {
        console.error(error);
        return void message.reply({content: 'Something went wrong!'});
    }
};