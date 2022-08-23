const { Interaction } = require('discord.js');

const commands = [
    {
        data: {
            name: 'react',
        },
        execute(message) {
            message.react('👍');
        }

    },
    {
        data: {
            name: 'differentReact',
        },
        execute(message) {
            message.react('👎');
        }

    },
    {
        data: {
            name: 'respond'
        },
        execute(message) {
            message.react('👍').then(() => message.react('👎'));
            const filter = (reaction, user) => {
                return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            message.awaitReactions({filter, max: 1, time: 10000, errors: ['time']})
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '👍') {
                        message.reply('You reacted with a thumbs up');
                    } else {
                        message.reply('You reacted with a thumbs down');
                    }
                })
                .catch(collected => {
                    message.reply('Time\'s up!');
            });
        }
    }
]

module.exports = commands;