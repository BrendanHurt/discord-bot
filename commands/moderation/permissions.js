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

/**
 * Either gets all the permissions for a user, or checks if the user has a given permission.
 * @param {Message} message The message that prompted the command
 * @param {[userId: int | @user: string, targetPermission: string]} args the user
 * and, optionally, a permission to check if the user has that permission
 */
async function userPermissions(message, args) {

    //--------------------add input validation later------------------------
    //remove the @ formatting if the user argument used an @
    const userID = isNaN(args[0]) ? args[0]?.slice(2,-1) : args[0];
    const permission = args[1];

    if (!userID || isNaN(userID)) {
        return void message.reply("No user, or invalid user, provided! Please use a user\'s ID, or an @ of a user");
    }

    //get the user
    const member = await message.guild.members.fetch(userID)
        .then()
        .catch(console.error);
    if (!member) {
        return void message.reply("Something went wrong while trying to find this user!");
    }

    const permissions = member.permissions.toArray();

    //checking if the user has a specific permission
    if (permission) {
        return void message.reply(`${member.user.username} ${permissions.includes(permission) ? "has" : "doesn\'t have"} the ${permission}  permission`);
    }

    //get all of the permissions for the user
    return void message.reply(permissions ? permissions.join("\n") : "No permissions found for that user!");
}

/**
 * Gets or edits the permissions of a role
 * @param {Message} message The message that prompted this command
 * @param {[roleId: Snowflake, action: string, permission: string, value: ]} args 
 * 
 * 
 * Role args:
 *      <roleID> <get | edit> [permission] [value]
 */
async function rolePermissions(message, args) {
    //check that the message author has the manage roles permission
    //(a bit janky, but )
    const authorMember = await message.guild.members.fetch(message.author.id);
    if (!authorMember.roles.highest.permissions.has("ManageRoles")) {
        return void message.reply("You don't have the ManageRoles permission!");
    }

    //get the role by its id
    const roleID = isNaN(args[0]) ? args[0]?.slice(3,-1) : args[0];
    if (!roleID || isNaN(roleID)) {
        return message.reply(`${args[0]} is not a valid role ID, please copy the ID for a role or use an @`);
    }
    const role = await message.guild.roles.fetch(roleID)
        .then()
        .catch(console.error);
    if (!role) { return void message.reply("Couldn\'t find that role!"); }

    const action = args[1];
    const permission = args[2];
    const value = (args[3]?.toLowerCase() === "allow") ? true 
        : (args[3]?.toLowerCase() === "deny") ? false : undefined;


    //get the role's permissions
    if (action === "get") {
        const rolePerms = role.permissions.toArray();

        //check for a specific permission on the role
        if (permission) {
            try {
                return void message.reply(`${role.name} ${role.permissions.has(permission) ? "has" : "doesn\'t have"} the ${permission} permission`);
            } catch(error) {
                console.error(error);
                return void message.reply(`Something went wrong! Possible that ${permission} is not a valid permission flag. Permissions flags are case sensitive and written in pascal case (e.g. ManageRoles)`);
            }
        }

        //getting all permissions, reply with either:
        //  1. The permissions for the role
        //  2. An error message stating that the role doesn't have any permissions
        return void message.reply(rolePerms.length > 0 ? rolePerms.join("\n") 
            : "This role doesn\'t have any permissions!");

    //edit the role's permissions
    } else if (action === "edit") {
        if (permission === undefined) { return void message.reply("No permissions provided!"); }
        if (value === undefined) { return void message.reply("Invalid value, please use allow or deny"); }
        const rolePerms = role.permissions.toArray();

        //giving the role a permission
        if (value) {
            rolePerms.push(permission);
            await role.setPermissions([...rolePerms])
                .then(() => {
                    return void message.reply(`${role.name} now has the ${permission} permission`);
                })
                .catch((error) => {
                    console.error(error);
                    return void message.reply("Something went wrong!");
                });
            return;
        }
        
        //removing a permission from a role
        const permIndex = rolePerms.indexOf(permission);
        if (permIndex === -1) { return void message.reply(`${role.name} didn\'t have the ${permission} permission`); }

        //remove the permission, clear the role's permissions, and re-add them
        rolePerms.splice(permIndex, 1);
        role.setPermissions(0n);
        role.setPermissions([...rolePerms]);
        return void message.reply(`Removed ${permission} from ${role.name}`);

    } else {
        return void message.reply("Invalid action, please use get or edit");
    }
}