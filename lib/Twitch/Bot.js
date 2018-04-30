var cfg = require('../../config.js');
var tmi = require('tmi.js');

var client = new tmi.client(cfg.tmi);

client.connect();

var Mouse = require('../controls').Mouse;
var Keyboard = require('../controls').Keyboard;
var mouse = new Mouse();
var keyboard = new Keyboard();

var commandsMap = {
    'mouse1': 'm1',
    'mouse2': 'm2',
    'jump': 'space',
    'spacebar': 'space',
    'forward': 'w',
    'backward': 's',
    'moveleft': 'a',
    'moveright': 'd',

    'ultimate': 'q',
    'ult': 'q',
    'ulti': 'q'
}

function chatParser(message) {
    // start by splitting all commands, comma separated
    var commands = message.split(',');
    // iterate through each. we need to match specific use cases so we need to check 
    for(var i = 0; i < commands.length; i++ ) {
        var command = commands[i].split('/')[0];
        var modifier = commands[i].split('/')[1];

        if(!!commandsMap[command]) {
            command = commandsMap[command]
        }

        switch (command) {
            case '1':
            case '2':
            case 'w':
            case 's':
            case 'a':
            case 'd': 
            case 'space':
            case 'q':
            case 'e':
            case 'r':
            case 'shift':
            case 'x':
                keyboard.queueOne(command,modifier);
                break;
            case 'm1':
            case 'm2':

            case 'up':
            case 'down':
            case 'left':
            case 'right':
                mouse.queueOne(command,modifier);
                break;
            default:
                console.log('Error', `Ignored unknown command ${command}`)
        }

    }
}


client.on('chat', (channel, userstate, message, isSelf ) => {
    if(isSelf) return;
    chatParser(message);
    return;
})

module.exports = client;