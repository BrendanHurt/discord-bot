exports.name = "isInteraction";

exports.run = async (message) => {
    return message.commandName !== undefined;
}