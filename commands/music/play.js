const { QueryType } = require('discord-player');
const { joinVoiceChannel } = require('@discordjs/voice');

exports.name = 'play';

exports.run = async (client, message, args) => {
    /////////////////////////////////////////////////////////////////////////
    //searching for a track

    const query = args[0]; //change this later

    const player = client.player;

    const searchResult = await player.search(query, {
        requestedBy: message.author.username,
        searchEngine: QueryType.AUTO
    })
    .catch(() => {console.log('error while searching for the given query')});

    if (!searchResult || !searchResult.tracks.length) {
        return void message.channel.send({content: 'No results were found!'});
    }

    /////////////////////////////////////////////////////////////////////////
    //creating the queue & connecting
    const queue = player.createQueue(message.guild, {
        metadata: message.channel,
        leaveOnEnd: false
    });
    try {
        if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch {
        void player.deleteQueue(message.guildId);
        return void message.channel.send({content: 'Could not join your voice channel!'});
    }

    /////////////////////////////////////////////////////////////////////////
    //adding the track, or tracks, to the queue

    await message.channel.send({content: `⏱ | loading your ${searchResult.playlist ? "playlist" : "track"}...`});
    try {
        
        //queueEmpty has to be set here otherwise it'll be set to the new track
        const queueEmpty = queue.nowPlaying() === undefined;
        const max = (args[1] !== undefined) ? args[1] : searchResult.length;

        if (searchResult.playlist) {
            for (let i = 0; i < max; i++) {
                setTimeout(function() {}, 2000);
                queue.addTrack(searchResult.tracks[i]);
            }
        } else {
            queue.addTrack(searchResult.tracks[0]);
        }

        if (queueEmpty) {await queue.play();}

    } catch (error) {
        console.error(error);
        message.channel.send('Something went wrong while trying to queue the request');
    }
}