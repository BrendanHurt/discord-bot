//TODO: remove file once all slash commands have be refactored
exports.run = async(client, interaction) => {
    const play = require("../../commands/music/play");
    play.run(client, interaction, null);
}