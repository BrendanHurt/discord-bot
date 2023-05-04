module.exports = (client) => {
    
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });
    
    client.on('error', console.error);

    client.on('warn', console.warn);
}