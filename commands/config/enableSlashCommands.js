//const { REST } = require("@discordjs/rest");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST, Routes } = require("discord.js");
const config = require("../../config.json");

exports.run = async (client, message, args) => {
    await message.client.application.fetch();
    if (message.author.id !== message.client.application.owner.id) { return; }

    commands = [
        new SlashCommandBuilder()
            .setName("current")
            .setDescription("Displays the currently playing track"),
        new SlashCommandBuilder()
            .setName("play")
            .setDescription("Adds a track or playlist to the music queue")
            .addStringOption(option => 
                option.setName("query")
                    .setDescription("The track or playlist you want to search for")
                    .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName("limit")
                    .setDescription("The maximum number of tracks you want to add from a playlist")
            ),
        new SlashCommandBuilder()
            .setName("queue")
            .setDescription("Displays the music queue"),
        new SlashCommandBuilder()
            .setName("remove_track")
            .setDescription("Removes the track at the given position in the queue")
            .addIntegerOption(option => 
                option.setName("position")
                    .setDescription("The position of the track that you want to remove")
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName("shuffle")
            .setDescription("Shuffles the music queue"),
        new SlashCommandBuilder()
            .setName("skip")
            .setDescription("Skips the currently playing track"),
        new SlashCommandBuilder()
            .setName("stop")
            .setDescription("The bot stops playing music and leaves the voice channel")
    ].map(command => command.toJSON());
    
    const rest = new REST({version: "10"}).setToken(client.token);
    try {
        console.log("Started refreshing application slash commands");

        await rest.put(Routes.applicationGuildCommands(client.application.id, message.guildId), {body: commands});

        console.log("Succesfully reloaded application slash commands");

        await message.reply("Slash commands are now enabled");
    } catch(error) {
        console.error(error);
        await message.reply("Something went wrong!");
    }
}

/*exports.run = async (client, message, args) => {
        await message.client.application.fetch();
        if (message.author.id !== message.client.application.owner.id) { return; }

        await message.guild.commands.set([
            {
                name: "play",
                description: "Plays a song",
                options: [
                    {
                        name: "query",
                        type: "STRING",
                        description: "The song you want to play",
                        required: true
                    },
                    {
                        name: "result_limit",
                        type: "INTEGER",
                        description: "The maximum number of results you want for this request",
                        required: false
                    }
                ] 
            },
            {
                name: "skip",
                description: "Skip the current song"
            },
            {
                name: "queue",
                description: "Displays the queue of songs"
            },
            {
                name: "stop",
                description: "Stop playing music"
            },
            {
                name: "current",
                description: "Displays the currently playing song"
            },
            {
                name: "remove_track",
                description: "Removes the specified track from the queue (i.e. /remove_track 3 removes the third track)",
                options: [{
                    name: "track_number",
                    type: "INTEGER",
                    description: "The position of the song in the queue",
                    required: true
                }]
            },
            {
                name: "shuffle",
                description: "Shuffles the queue"
            }
        ]);

    await message.reply("Slash commands are now enabled!");
}*/