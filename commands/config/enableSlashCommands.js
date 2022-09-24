const { 
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandRoleOption,
    SlashCommandSubcommandGroupBuilder,
    SlashCommandUserOption,
    SlashCommandStringOption
} = require("discord.js");
const { REST, Routes } = require("discord.js");

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
            .setDescription("The bot stops playing music and leaves the voice channel"),


        //permissions
        new SlashCommandBuilder()
            .setName("permissions")
            .setDescription("Get or edit the permissions of a user")
            .addSubcommandGroup(
                new SlashCommandSubcommandGroupBuilder()
                    .setName("role")
                    .setDescription("Get or edit the permissions of a role")
                    .addSubcommand(
                        new SlashCommandSubcommandBuilder()
                            .setName("get")
                            .setDescription("Get the permissions of a role")
                            .addRoleOption(
                                new SlashCommandRoleOption()
                                    .setName("role")
                                    .setDescription("The role who\'s permissions you want to get")
                                    .setRequired(true)
                            )
                            .addStringOption(
                                new SlashCommandStringOption()
                                    .setName("permission")
                                    .setDescription("Check if the roles has this specific permission")
                            )
                    )
                    .addSubcommand(
                        new SlashCommandSubcommandBuilder()
                            .setName("edit")
                            .setDescription("Edit the permissions of a role")
                            .addRoleOption(
                                new SlashCommandRoleOption()
                                    .setName("role")
                                    .setDescription("The role who\'s permissions you want to edit")
                                    .setRequired(true)
                            )
                            .addStringOption(
                                new SlashCommandStringOption()
                                    .setName("permission")
                                    .setDescription("The permission to be editted")
                                    .setRequired(true)
                            )
                            .addStringOption(
                                new SlashCommandStringOption()
                                    .setName("value")
                                    .setDescription("Set the permission for this role to allow or deny")
                                    .setRequired(true)
                                    .setChoices(
                                        { name: "Allow", value: "allow" },
                                        { name: "Deny", value: "deny"},
                                    )
                            )
                    )
            )
            .addSubcommand(
                new SlashCommandSubcommandBuilder()
                    .setName("user")
                    .setDescription("Get the permissions of a user")
                    .addUserOption(
                        new SlashCommandUserOption()
                            .setName("user")
                            .setDescription("The user who's permissions you want to get")
                            .setRequired(true)
                    )
                    .addStringOption(
                        new SlashCommandStringOption()
                            .setName("permission")
                            .setDescription("Check if the user has this specific permission")
                    )
            )
                
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