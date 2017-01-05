var EventEmitter = require('events').EventEmitter;

function construct(contructor, args) {
    function fn() {
        return new contructor(...args);
    }

    fn.prototype = contructor.prototype;
    return new fn();
}

class Sender extends EventEmitter {
    constructor(client, senderId, receiverId) {
        super();
        this.client = client;
        this.senderId = senderId;
        this.receiverId = receiverId;
    }

    close() {
        this.senderId = null;
        this.receiverId = null;
        this.client = null;
    };

    createController() {
        var args = Array.prototype.slice.call(arguments);
        var Controller = args.shift();
        return construct(Controller, [this.client, this.senderId, this.receiverId].concat(args));
    };
}


module.exports = Sender;