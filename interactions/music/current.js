exports.run = async (client, interaction) => {
    require("../../commands/music/current").run(client, interaction, null);
}