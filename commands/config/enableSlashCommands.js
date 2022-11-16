const { 
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandRoleOption,
    SlashCommandSubcommandGroupBuilder,
    SlashCommandUserOption,
    SlashCommandStringOption,
    SlashCommandChannelOption
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
            .setName("remove-track")
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

        //@TODO: add auto-complete to the permissions
        //@TODO: add logging to the moderation commands
        new SlashCommandBuilder()
            .setName("set-perms")
            .setDescription("Set the permissions for a role, or channel overwrites for a role or user in a channel")
            //subcommand group for channel overwrites for users & roles
            .addSubcommandGroup(
                new SlashCommandSubcommandGroupBuilder()
                    .setName("channel-overwrites")
                    .setDescription("Overwrite permissions for a user or role in a channel")
                    //role overwrites subcommand
                    .addSubcommand(
                        new SlashCommandSubcommandBuilder()
                            .setName("role")
                            .setDescription("Set the overwrites for a role in the given channel")
                            .addStringOption(
                                new SlashCommandStringOption()
                                    .setName("permission-value")
                                    .setDescription("Setting the overwrites to be allowed or denied")
                                    .setChoices(
                                        { name: "Allow", value: "allow" },
                                        { name: "Deny", value: "deny" },
                                        { name: "Default", value: "default" }
                                    )
                                    .setRequired(true)
                            )
                            .addStringOption(
                                new SlashCommandStringOption()
                                    .setName("permissions")
                                    .setDescription("The permissions you want to overwrite")
                                    .setRequired(true)
                            )
                            .addRoleOption(
                                new SlashCommandRoleOption()
                                    .setName("role")
                                    .setDescription("The role who's permissions you want to overwrite")
                                    .setRequired(true)
                            )
                            .addChannelOption(
                                new SlashCommandChannelOption()
                                    .setName("channel")
                                    .setDescription("The channel where the role\'s permissions will be overwritten")
                                    .setRequired(true)
                            )
                    )
                    //user overwrites subcommand
                    .addSubcommand(
                        new SlashCommandSubcommandBuilder()
                            .setName("user")
                            .setDescription("Overwrite the permissions for a user in the channel")
                            .addStringOption(
                                new SlashCommandStringOption()
                                    .setName("permission-value")
                                    .setDescription("Setting the overwrites to be allowed or denied")
                                    .addChoices(
                                        { name: "Allow", value: "allow" },
                                        { name: "Deny", value: "deny" },
                                        { name: "Default", value: "default" }
                                    )
                                    .setRequired(true)
                            )
                            .addStringOption(
                                new SlashCommandStringOption()
                                    .setName("permissions")
                                    .setDescription("The permissions you want to overwrite")
                                    .setRequired(true)
                            )
                            .addUserOption(
                                new SlashCommandUserOption()
                                    .setName("user")
                                    .setDescription("The user who's permissions you want to overwrite")
                                    .setRequired(true)
                            )
                            .addChannelOption(
                                new SlashCommandChannelOption()
                                    .setName("channel")
                                    .setDescription("The channel where the user\'s permissions will be overwritten")
                                    .setRequired(true)
                            )
                    )
            )
            //subcommand for role permissions
            .addSubcommand(
                new SlashCommandSubcommandBuilder()
                    .setName("role")
                    .setDescription("Change the permissions for a role")
                    .addStringOption(
                        new SlashCommandStringOption()
                            .setName("permission-value")
                            .setDescription("Setting the permissions to be allowed or denied")
                            .addChoices(
                                { name: "Allow", value: "allow" },
                                { name: "Deny", value: "deny" }
                            )
                            .setRequired(true)
                    )
                    .addStringOption(
                        new SlashCommandStringOption()
                            .setName("permissions")
                            .setDescription("The permissions that you want to change")
                            .setRequired(true)
                    )
                    .addRoleOption(
                        new SlashCommandRoleOption()
                            .setName("role")
                            .setDescription("The role who\'s permissions you want to change")
                            .setRequired(true)
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