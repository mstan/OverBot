var robot = require('robotjs');

var EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

var inputsMapping = {
    'm1': 'left',
    'm2': 'right'
}

// declares a new Mouse
function Mouse() {
    // list of key press commands to be consumed
    this.commands = [];
    this.screenHeight = robot.getScreenSize().height;
    this.screenWidth = robot.getScreenSize().width;

    // each time new input is being added, start processing the array
    myEmitter.on('newInput', () => {
        this.dequeue();
    })
}

// add one to the array
Mouse.prototype.queueOne = function(input,duration) {
    this.commands.push({ input, duration });
    myEmitter.emit('newInput');
}



// toggle a key by pressing it down for a set amount of time, then letting up after 
// a set duration
Mouse.prototype.toggleClick = function(button,duration) {
    var DURATION_MIN = 2000;
    var DURATION_MAX = 5000; // 5000 milliseconds
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
    robot.mouseToggle('down', button)

    // after the duration, let it go
    setTimeout( () => {
        robot.mouseToggle('up', button);
        return;
    }, duration)
}


// move the mouse a certain direction for a specified duration
Mouse.prototype.moveMouse = function(direction,precision) {
    const MAX_PRECISION = 1
    const MIN_PRECISION = .5;

    function moveMouse(x,y) {
        robot.moveMouseSmooth(x,y);
        return;
    }

    if(!precision) {
        precision = 1;
    }
    if(precision < MIN_PRECISION) {
        precision = MIN_PRECISION
    }
    if(precision > MAX_PRECISION) {
        precision = MAX_PRECISION;
    }

    switch (direction) {
        case 'left':
            // if we wanted to move all the way to the left, we could just set the x to 0
            // however, we want to add precision
            // therefore a person can add how precise they want to be 
            // in this case, if precision is set to 1 (all the way),
            // we would subtract the screenWidth by itself (as screenWidth / 1) = screenWidth )
            // .5 would be center
            // .75 would be halfway to that direction
            var x = ( this.screenWidth * ( MAX_PRECISION - precision) );
            var y = robot.getMousePos().y;
            break;
        case 'right':
            // right is the full screenwidth, so if divided by 1, it remains the full width
            // therefore just divide
            var x = this.screenWidth - (this.screenWidth * (MAX_PRECISION - precision) );
            var y = robot.getMousePos().y;
            break;
        case 'up':
            var x = robot.getMousePos().x;
            var y = ( this.screenHeight * (MAX_PRECISION - precision) );
            break;
        case 'down':
            var x = robot.getMousePos().x;
            var y = this.screenHeight - ( this.screenHeight * (MAX_PRECISION - precision) );
            break;
    }
    moveMouse(x,y);
}

// go through the process of checking what's on the array.
// if something exists, check that it matches our switch case of valid
// keys that the user is allow to request
// then toggle it for a set period of time
// and dequeue it 
Mouse.prototype.dequeue = function() {
    if( this.commands.length == 0) {
        return;
    }

    var input = this.commands[0].input;
    var duration = this.commands[0].duration;

    switch (input) {
        case 'm1': // primary fire
        case 'm2': // secondary fire
            this.toggleClick( inputsMapping[input], duration);
            break;
        case 'left':
        case 'right':
        case 'up':
        case 'down': 
            this.moveMouse(input, duration);
            break;
        default: 
            console.error('invalid input: ', input)
    }
    // remove command from queue now that it's been consumed
    this.commands.shift();
}

 // declare with new Keyboard();
module.exports = Mouse;
