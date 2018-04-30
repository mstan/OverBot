var robot = require('robotjs');

var EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();


// declares a new keyboard
function Keyboard() {
    // list of key press commands to be consumed
    this.commands = [];

    // each time new input is being added, start processing the array
    myEmitter.on('newInput', () => {
        this.dequeue();
    })
}

// add one to the array
Keyboard.prototype.queueOne = function(key,duration) {
    this.commands.push({ key, duration });
    myEmitter.emit('newInput');
}

// toggle a key by pressing it down for a set amount of time, then letting up after 
// a set duration
Keyboard.prototype.toggleOne = function(key,duration) {
    var DURATION_MIN = 2000; // 2 seconds
    var DURATION_MAX = 5000; // 5 seconds
    //don't let a person set a ridiculously long timeout for pressing down a key
    if(!duration) {
        duration = DURATION_MIN;
    }
    if(duration < DURATION_MIN) {
        duration = DURATION_MIN;
    }
    if(duration > DURATION_MAX) {
        duration = DURATION_MAX;
    }

    // press it down
    robot.keyToggle(key, 'down');

    // after the duration, let it go
    setTimeout( () => {
        robot.keyToggle(key, 'up');
        return;
    }, duration)
}

// go through the process of checking what's on the array.
// if something exists, check that it matches our switch case of valid
// keys that the user is allow to request
// then toggle it for a set period of time
// and dequeue it 
Keyboard.prototype.dequeue = function() {
    if( this.commands.length == 0) {
        return;
    }

    var key = this.commands[0].key;
    var duration = this.commands[0].duration;

    switch (key) {
        case 'w': // movement (forward)
        case 's': // movement (backward)
        case 'a': // movement (left)
        case 'd': // movement (right)
        case 'q': // ability (ultimate)
        case 'e': // ability
        case 'r': // reload
        case 'x': // communication (healing)
        case 'shift':
        case 'space':
            this.toggleOne(key,duration);
            //robot.keyTap( this.commands[0]);
            break;
        default: 
            console.error('invalid input: ', key)
    }
    // remove command from queue now that it's been consumed
    this.commands.shift();
}

// return a list of commands
/*
Keyboard.prototype.getCommands = function() {
    return this.commands;
}
*/

 // declare with new Keyboard();
module.exports = Keyboard;
