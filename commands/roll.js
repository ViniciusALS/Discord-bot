const request = require('request');
const {tenor_key} = require("../config.json");



module.exports = {
    
    name: 'roll',

    aliases: ["rola", "joga", "rol", "rool", "r", "d"],
    usage: "< dice > [ - / + ] [ detuction / adition ]",

    cooldown: 5,
    
    description: 'Rolls dice',
    
    execute(message, args) {

        //Takes the first argument as the dice sides.
        let dice = Number(args[0]);

        
        //Checks if the dice is an valid number.
        if(isNaN(dice)) return;


        //Calculates a pseudo-random number based on dice`s sides.
        let diceResult = Math.floor(Math.random() * dice) + 1;

        
        //Adds the dice value to some aditional value.
        if(args[1] === "+" && args[2] !== NaN){

            //Initializes aditional as the third argument
            let aditional = Number(args[2]);

            //Checks if the the aditional value is a valid integer value. Exits earlier if not.
            if(isNaN(aditional)) return;

            let pureDiceResult = diceResult;
              
            diceResult += aditional;

            //Send result on discord chat.
            message.reply(` rolled: ${diceResult}. (${pureDiceResult} + ${aditional})`);
        
        } else if (args[1] === "-" && args[2] !== NaN) {

            aditional = Number(args[2]);

            if(isNaN(aditional)) return;

            let pureDiceResult = diceResult;
              
            diceResult -= aditional;

            if(diceResult < 0)
                diceResult = 0;

            message.reply(` rolled: ${diceResult}. (${pureDiceResult} - ${aditional})`);

        } else {
            
            //Send result on discord chat.
            message.reply(` rolled: ${diceResult}`);

        }
	}
};