const getFiles = require('./getFiles');

/**
 * Summary: Maps the names and aliases to the execution of all commands in the given
 *          directory and stores them in the given collection.
 * @param {Client} client           Interaction point w/ the Discord API.
 * @param {Collection} collection   The collection the commands will be stored in.
 * @param {String} directory        The directory to search through.
 */
module.exports = async (client, collection, directory) => {
    const files = await getFiles(directory);

    files.forEach(file => {
        const commandName = file.split('/').pop().slice(0, -3);
        const command = require(`.${file}`);
        const aliases = require(`.${file}`).aliases;

        collection.set(commandName.toLowerCase(), command);

        //handle the aliases
        if (aliases !== undefined) {
            for (alias of aliases) {
                collection.set(alias.toLowerCase(), command);
            }
        }
    });
}