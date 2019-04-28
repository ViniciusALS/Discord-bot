const { prefix } = require('../config.json');

module.exports = {

    name: "help",
    aliases: ["h"],
    usage: "[ command ]",
    cooldown: 5,
    description: "Helps with the bot`s commands.",
   
    execute(message, args){

        //Initialize an array for all the data to be displayed. 
        const data = [];
        const { commands } = message.client;

        //Executes only if no argument was passed.
        if(!args.length){
            
            //Pushes a list of all possible commands to data.
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            //Send message to author`s DM and throws an error if not able to send messages on DM.
            return message.author.send(data.join('\n'), { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        //
        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
    }
}