const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player, useMasterPlayer } = require('discord-player');
require(`dotenv`).config();
const client = new Client({
    intents : [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const player = Player.singleton(client);

const commandCategories = ["music", "moderation", "config"];
client.commands = new Collection();
client.interactionCommands = new Collection();
//load the commands into the collections
for (const category of commandCategories) {
    require("./util/commandLoader")(client, client.commands, "./commands/" + category);
    require("./util/commandLoader")(client, client.interactionCommands, "./commands/" + category);
}

const eventHandler = require('./events/handlers/eventHandler')(client);
const musicEventHandler = require(`./events/handlers/musicEventHandlers`)();
const clientEventHandlers = require(`./events/handlers/clientEventHandlers`)(client);

//API error listener, move somewhere else later
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(process.env.TOKEN);