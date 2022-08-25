const { EmbedBuilder } = require("discord.js");
exports.aliases = ['nowPlaying'];

exports.run = (client, message, args) => {
    const queue = client.player.getQueue(message.guildId);
    if (!queue || queue.nowPlaying() === undefined) {
        return void message.reply({content: '❌ | Not playing music right now!'});
    }

    const track = queue.nowPlaying();

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Now Playing')
        .setThumbnail(track.setThumbnail)
        .addFields({name: "Track Title:", value: track.title, inline: true})
        .addFields({name: "Track Length", value: track.duration, inline: true});

    return void message.reply({embeds: [embed]});
};