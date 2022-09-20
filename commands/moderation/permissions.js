const { PermissionsBitField } = require("discord.js");


/**
 * Gets permissions for users and roles, and can also edit the permissions of roles.
 * @param {Client} client The client application
 * @param {Message} message The message that prompted this command
 * @param {*} args 
 * 
 * Current structure of the arguments (definitely subject to change):
 *  For users:
 *      <user> <userID | user@> [permission]
 *  For roles:
 *      <role> <roleID> <get | edit> [permission] [value]
 * 
 */
exports.run = async (client, message, args) => {
    
    const user = await message.guild.members.fetch(message.author.id);

    if (!user.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return void message.reply("Only admins can use the permissions command!");
    }

    const target = args.shift();
    if (target === "user") {
        userPermissions(message, args);

    } else if (target === "role") {
        rolePermissions(message, args);

    } else {
        return void message.reply("Invalid permissions call!");
    }
}

async function userPermissions(message, args) {

    //--------------------add input validation later------------------------
    //remove the @ formatting if the user argument used an @
    const userID = isNaN(args[0]) ? args[0]?.slice(2,-1) : args[0];
    const targetPermission = args[1];

    if (!userID || isNaN(userID)) {
        return void message.reply("No user, or invalid user, provided! Please use a user\'s ID, or an @ of a user");
    }

    //get the user
    const user = await message.guild.members.fetch(userID)
        .then()
        .catch(console.error);
    if (!user) {
        return void message.reply("Something went wrong while trying to find this user!");
    }

    const permissions = user.permissions.toArray();

    //checking if the user has a specific permission
    if (targetPermission) {
        return void message.reply(`This user ${permissions.includes(targetPermission) ? "does" : "doesn\'t"} have this permission`);
    }

    //get all of the permissions for the user
    return void message.reply(permissions ? permissions.join("\n") : "No permissions found for that user!");
}

async function rolePermissions(message, args) {
    return void message.reply("Role permissions are currently being implemented!");
}