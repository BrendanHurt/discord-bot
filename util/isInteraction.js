module.exports = isInteraction = (message) => {
    return message.commandName !== undefined;
}