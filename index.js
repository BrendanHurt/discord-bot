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
client.player = player; //find a better way to do this later

client.commands = new Collection();
client.interactions = new Collection();
client.embedMessage = undefined; //find a better way to do this later

const commandHandler = require('./util/commandLoader')(client, client.commands, './commands');
const interactionHandler = require('./util/commandLoader')(client, client.interactions, './commands');
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
const { EmbedBuilder } = require('@discordjs/builders');
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

player.on('error', (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on('connectionError', (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on('trackStart', async (queue, track) => {
    queue.metadata.send({embeds: [createPlayerEmbed(track)]});
    /*if (!client.embedMessage) {
        client.embedMessage = await queue.metadata.send({embeds: [createPlayerEmbed(track)]});
    } else {
        client.embedMessage.edit({embeds: [createPlayerEmbed(track)]});
    }*/
});
player.on('trackEnd', (queue, track) => {
    queue.metadata.send(`✅ | ${track.title} finished playing!`);
});

/*player.on('trackAdd', (queue, track) => {
    queue.metadata.send(`🎶 | Added **${track.title}** to the queue`);
});
player.on('tracksAdd', (queue, track) => {
    queue.metadata.send('Playlist added to the queue!');
});*/

player.on('botDisconnect', (queue) => {
    queue.metadata.send(`❌ | Manually disconnected from the voice channel, clearing the queue!`);
});
player.on('channelEmpty', (queue) => {
    queue.metadata.send(`❌ | The voice channel is empty, clearing the queue!`);
});
player.on('queueEnd', (queue) => {
    queue.metadata.send(`✅ | Queue finished!`);
});

client.login(config.token);