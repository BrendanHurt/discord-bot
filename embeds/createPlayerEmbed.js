const { EmbedBuilder } = require("discord.js");

module.exports = (track) => {
    const playerEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Music Player')
        .setDescription('Playing requested music, use !play or /play to request a song or playlist!')
        .setThumbnail(track.thumbnail)
        .addFields({name: 'Currently playing: ', value: track.title, inline: true})
        .addFields({name: 'Track Length:', value: track.duration, inline: true});

    return playerEmbed;
}