/**
 * @param {Message} message the message that prompted the command
 * @param {Queue} queue the queue that's being checked
 * @return {boolean} returns false if the queue is empty, and true if it isn't empty
 */
module.exports = (message, queue) => {
    if (!queue || !queue.playing) {
        void message.reply({content: '❌ | No music is playing!', ephemeral: true});
        return false;
    }
    return true;
}