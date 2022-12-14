const { Message } = require("discord.js");
const isInteraction = require("../../util/isInteraction");

/**
 * Sets the permissions for a role, or the overwrites in a channel for
 * a user or a role.
 * @param {Client} client The client application running the bot
 * @param {Message} message The message that prompted the command
 */
exports.run = async (client, message) => {
    if (!isInteraction(message)) {
        return void message.reply("Changing permissions is only supported via slash commands");
    }
    //defer in case setting the permissions takes too long
    await message.deferReply()
        .then()
        .catch(console.error);

    //parse the options
    const possiblePermValues = {
        "allow": true,
        "deny": false,
        "default": null
    }
    //const permValue = (message.options.get("allow-or-deny").value === "allow") ? true : false;
    const permValue = possiblePermValues[message.options.get("permission-value")?.value];
    const permissions = message.options.get("permissions")?.value.split(/ +/g);
    const roleOrUser = (message.options.get("role")) ? 
        message.options.get("role")?.value : message.options.get("user")?.value;

    //handling role permissions
    if (message.options.get("channel")?.value === undefined) {
        rolePerms(message, permValue, permissions, roleOrUser);
        return;
    }

    //handling channel overwrites
    const channel = message.options.get("channel").value;
    channelOverwrites(message, permValue, permissions, channel, roleOrUser);
}

/**
 * Sets the given permissions to be allowed or denied for the given role.
 * @param {Message} message Message that prompted the command, used for getting options
 * @param {bool} permValue Whether to allow or deny the permissions
 * @param {[string]} perms The array of permissions being changed
 * @param {Snowflake} roleID The role or user who's permissions are being changed
 */
async function rolePerms(message, permValue, perms, roleID) {

    if (permValue === null) {
        return void message.followUp({content: "Role permissions can only be allowed or denied", ephemeral: true});
    }

    //get the permissions for that role & put them in an array
    const role = await message.guild.roles.fetch(roleID);
    const roleName = role.name;
    const rolePerms = role.permissions.toArray();

    for (const perm of perms) {
        const index = rolePerms.indexOf(perm);
        //allow perm
        if (permValue && index === -1) { rolePerms.push(perm); }
        //deny perm
        else if (!permValue && index !== -1) { rolePerms.splice(index, 1)};
    }
    
    //setting the permissions
    await role.setPermissions([...rolePerms])
        .then(() => {
            return void message.followUp(`Permissions set to ${permValue ? "allowed" : "denied"} for ${roleName}`);
        })
        .catch((error) => {
            console.error();
            return void message.followUp({content: "Something went wrong!", ephemeral: true});
        });
}

/**
 * Sets the specified overwrites in a given channel for a given user or role.
 * @param {Message} message The message that prompted the command, used for getting options
 * @param {bool} permValue Whether to allow or deny the permissions, or set them to default
 * @param {[string]} perms The array of permissions being changed
 * @param {Channel} targetChannel The channel who's overwrites are being changed
 * @param {Role | User} userOrRoleID The user/role who's overwrites for the channel are being changed
 * 
 * @TODO add the option to give a reason for changing permission overwrites
 */
async function channelOverwrites(message, permValue, perms, targetChannel, userOrRoleID) {

    const isUser = message.options._subcommand === "user";
    const userOrRole = await (isUser ? message.guild.members.fetch(userOrRoleID) : message.guild.roles.fetch(userOrRoleID));
    const channel = await message.guild.channels.fetch(targetChannel);
    //for response message
    const permValueString = permValue ? "allowed" : (permValue === false) ? "denied" : "default";
    
    let permOverwriteOptions = {};

    //get the overwrites set for the target user/role, if there isn't one, create one
    //then, set the values of each permission based on the allowFlag
    for (const perm of perms) {
        Object.assign(permOverwriteOptions, {[perm]: permValue});
    }

    await channel.permissionOverwrites.edit(userOrRole, permOverwriteOptions)
        .then()
        .catch(console.error);

    return void message.followUp(`Channel overwrites in ${channel.name} set to ${permValueString} for ${isUser ? userOrRole.user.username : userOrRole.name}`);
}