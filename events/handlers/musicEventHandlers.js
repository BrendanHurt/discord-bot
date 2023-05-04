const { useMasterPlayer } = require("discord-player");
const createPlayerEmbed = require(`../../embeds/createPlayerEmbed`);

module.exports = () => {
    const player = useMasterPlayer();

    player.events.on(`error`, (queue, error) => {
        console.log(`[${queue.guild.name}] encountered an error: ${error.meesage}`);
    });

    player.events.on('playerError', (queue, error, track) => {
        console.log(`[${queue.guild.name}] encountered a player error: ${error.message}`);
    });

    player.events.on(`connection`, (queue) => {
        console.log(`Sucessfully connected`);
    });
    
    player.events.on('playerStart', (queue, track) => {
        queue.metadata.channel.send({embeds: [createPlayerEmbed(track)]});
    });

    player.events.on('playerFinish', (queue, track) => {
        queue.metadata.channel.send(`✅ | ${track.title} finished playing!`);
    });
    
    player.events.on('audioTrackAdd', (queue, track) => {
        queue.metadata.channel.send(`🎶 | Added **${track.title}** to the queue`);
    });

    player.events.on('audioTracksAdd', (queue, tracks) => {
        queue.metadata.channel.send('Playlist added to the queue!');
    });
    
    player.events.on('disconnect', (queue) => {
        queue.metadata.channel.send(`❌ | Manually disconnected from the voice channel, clearing the queue!`);
    });

    player.events.on('emptyChannel', (queue) => {
        queue.metadata.channel.send(`❌ | The voice channel is empty, clearing the queue!`);
    });

    player.events.on('emptyQueue', (queue) => {
        queue.metadata.channel.send(`✅ | Queue finished!`);
    });
}