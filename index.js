const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//Defines the cooldowns discord collection.
const cooldowns = new Discord.Collection();

//Alerts when bot is running.
client.once('ready', () => {
    console.log('Ready!');
    
});

//Checks for any message sent on chat
client.on("message", message => {


    //Exit if messaged came from bot himself or is not a bot command
    if (!message.content.startsWith(prefix) || message.author.bot) return;


    //Split the actual bot command from possible arguments
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();


    //Checks if command passed exists and exit earlier if not.
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;


    //Checks if the cooldowns collection already has the set in it. If not, then add it
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    //Sets a time stamp when a command is used
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;


    //Checks if the message author`s time stamp has already expired
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return;
        }
    
        //Deletes time stamp from the message author after cooldown has passed.
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }


    //Tries to execute command and returns an error if not possible
    try {
        command.execute(message, args);

    } catch (error) {

        console.error(error);
        message.reply(' there was an error trying to execute that command!');
    }
    
});

//Logs using token.
client.login(token);