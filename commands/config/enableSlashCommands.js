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
            .setName("pause")
            .setDescription("Pauses the music player"),
        new SlashCommandBuilder()
            .setName("resume")
            .setDescription("The player resumes playing music"),
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

    console.log(commands[1]);
    
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