/**
 * @param {Message} message the message that prompted the command
 * @param {Queue} queue the queue that's being checked
 * @return {boolean} returns false if the queue is empty, and true if it isn't empty
 */
module.exports = (message, queue) => {
    if (!queue) {
        void message.reply({conent: `❌ | There isn't a queue!`, ephemeral: true});
        return false
    }
    if (queue.isEmpty() && !queue.node.isPlaying()) {
        void message.reply({content: '❌ | The queue is empty!', ephemeral: true});
        return false;
    }
    return true;
}