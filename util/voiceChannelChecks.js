const { GuildMember } = require("discord.js")

/**
 * Summary: Checks whether or not the user is in the right voice channel for the command.
 * @param {Interaction} interaction 
 * @returns {bool} Returns true if checks are passed, and a failure message if either are not.
 */
module.exports = (interaction) => {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        return void interaction.followUp({content: 'You aren\'t in a voice channel', ephermal: true});
    }
    /*if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId != interaction.guild.me.voice.channelId) {
        return void interaction.followUp({content: 'You aren\'t in my voice channel!', ephermal: true});
    }*/
    return true;
}