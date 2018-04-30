var Mouse = require('../lib/controls').Mouse;
var mouse = new Mouse();

// simulated valid keys
var input = [
    'm1', 'm2',
    ]
var movement = [
    'up', 'down', 'left', 'right'
    ]

var randomInput = function() {
    return input[ Math.floor(Math.random() * input.length) ]
}

var randomMovement = function() {
    return movement[ Math.floor(Math.random() * movement.length) ]
}

//random time refers to a random length of time before doing an aciton
var randomTime = function () {
    return Math.floor( Math.random() * 1000 * 5 );
}

// precision refers to a random subset of the screen while performing an input
var randomPrecision = function() {
    return Math.random();
}

module.exports = function(inputRate) {
    //input rate, in milliseconds
    const INPUT_RATE = inputRate || 750;

    setInterval( () => {
        mouse.queueOne( randomInput() , randomInput() );
        mouse.queueOne( randomMovement(), randomPrecision() );
    }, INPUT_RATE)
}

