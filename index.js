const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const config = require('./config.json');
const client = new Client({
    intents : [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const player = new Player(client);
client.player = player;
client.embedMessage = undefined; //find a better way to do this later

const commandCategories = ["music", "moderation", "config"];
client.commands = new Collection();
client.interactionCommands = new Collection();
//load the commands into the collections
for (const category of commandCategories) {
    require("./util/commandLoader")(client, client.commands, "./commands/" + category);
    require("./util/commandLoader")(client, client.interactionCommands, "./commands/" + category);
}

const eventHandler = require('./util/eventHandler')(client);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    //console.log(`Commands:\n${[...client.commands.keys()]}`);
    //console.log(`Interactions:\n${[...client.interactions.keys()]}`);
});
client.on('error', console.error);
client.on('warn', console.warn);

//API error listener, move somewhere else later
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});


//////////////////////////////////////////////////////////////////////
//discord player stuff, move later
const { EmbedBuilder } = require("discord.js");
function createPlayerEmbed(track) {
    const playerEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Music Player')
        .setDescription('Playing requested music, use !play or /play to request a song or playlist!')
        .setThumbnail(track.thumbnail)
        .addFields({name: 'Currently playing: ', value: track.title, inline: true})
        .addFields({name: 'Track Length:', value: track.duration, inline: true});

    return playerEmbed;
}

player.events.on('error', (queue, error) => {
    console.log(`[${queue.guild.name}] emitted error:\n${error}`);
});
player.events.on('playerError', (queue, error, track) => {
    console.log(`[${queue.guild.name}] emitted ${error}`);
});

player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send({embeds: [createPlayerEmbed(track)]});
    /*if (!client.embedMessage) {
        client.embedMessage = await queue.metadata.send({embeds: [createPlayerEmbed(track)]});
    } else {
        client.embedMessage.edit({embeds: [createPlayerEmbed(track)]});
    }*/
});
player.events.on('trackEnd', (queue, track) => {
    queue.metadata.channel.send(`✅ | ${track.title} finished playing!`);
});

/*player.on('audioTrackAdd', (queue, track) => {
    queue.metadata.send(`🎶 | Added **${track.title}** to the queue`);
});
player.on('audioTracksAdd', (queue, track) => {
    queue.metadata.send('Playlist added to the queue!');
});*/

player.events.on(`playerSkip`, (queue, track) => {
    queue.metadata.channel.send(`Skipping track: ${track.title}`);
});

player.events.on('disconnect', (queue) => {
    queue.metadata.channel.send(`❌ | Manually disconnected from the voice channel, clearing the queue!`);
});
player.events.on('channelEmpty', (queue) => {
    queue.metadata.channel.send(`❌ | The voice channel is empty, clearing the queue!`);
});
player.events.on('emptyQueue', (queue) => {
    queue.metadata.channel.send(`✅ | Queue finished!`);
});

client.login(config.token);