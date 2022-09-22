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
    const targetPerms = args[1];

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

    //get the permissions
    getPerms(message, member, targetPerms);
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
    const targetPerms = args[2];
    const value = (args[3]?.toLowerCase() === "allow") ? true 
        : (args[3]?.toLowerCase() === "deny") ? false : undefined;



    //get the role's permissions
    if (action === "get") {
        getPerms(message, role, targetPerms);

    //edit the role's permissions
    } else if (action === "edit") {
        if (targetPerms === undefined) { return void message.reply("No permissions provided!"); }
        if (value === undefined) { return void message.reply("Invalid value, please use allow or deny"); }
        const rolePerms = role.permissions.toArray();

        //giving the role a permission
        if (value) {
            rolePerms.push(targetPerms);
            await role.setPermissions([...rolePerms])
                .then(() => {
                    return void message.reply(`${role.name} now has the ${targetPerms} permission`);
                })
                .catch((error) => {
                    console.error(error);
                    return void message.reply("Something went wrong!");
                });
            return;
        }
        
        //removing a permission from a role
        const permIndex = rolePerms.indexOf(targetPerms);
        if (permIndex === -1) { return void message.reply(`${role.name} didn\'t have the ${targetPerms} permission`); }

        //remove the permission, clear the role's permissions, and re-add them
        rolePerms.splice(permIndex, 1);
        role.setPermissions(0n);
        role.setPermissions([...rolePerms]);
        return void message.reply(`Removed ${targetPerms} from ${role.name}`);

    } else {
        return void message.reply("Invalid action, please use get or edit");
    }
}


/**
 * Either gets all of the permissions for a user or role, or checks if they have
 * a specific permission.
 * @param {Message} message The message that prompted the command calling this function
 * @param {User | Role} target The user or role whose permissions are being retrieved
 * @param {[PermissionResolvable]} permsToCheck Optional argument to check if the user or role has a specific permission
 */
 function getPerms(message, target, permsToCheck) {
    const targetPerms = target.permissions.toArray();
    const name = target.name ? target.name : target.user.username;

    //check if the target has a certain permission
    if (permsToCheck) {
        try {
            return void message.reply(`${name} ${targetPerms.includes(permsToCheck) ? "has" : "doesn\'t have"} the ${permsToCheck} permission`);
        } catch(error) {
            console.error(error);
            return void message.reply(`${permsToCheck} is not a valid permission`);
        }
    }

    //getting all permissions, reply with either:
    //  1. The permissions for the target
    //  2. An error message stating that the target doesn't have any permissions
    return void message.reply(targetPerms.length > 0 ? targetPerms.join("\n") 
        : `${name} doesn\'t have any permissions!`);
}