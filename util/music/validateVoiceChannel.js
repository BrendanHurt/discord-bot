const { GuildMember } = require("discord.js")

/**
 * Summary: Checks whether or not the user is in the right voice channel for the command.
 * @param {Message} message 
 * @returns {bool} false if the 
 */
module.exports = (message, queue) => {
    if (!(message.member instanceof GuildMember) || !message.member.voice.channel) {
        void message.reply({content: "You aren\'t in a voice channel", ephemeral: true});
        return false;
    }
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId != message.guild.members.me.voice.channelId) {
        void message.reply({content: "You aren\'t in my voice channel!", ephemeral: true});
        return false;
    }
    return true;
}