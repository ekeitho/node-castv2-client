var EventEmitter = require('events').EventEmitter;

class Controller extends EventEmitter {
    constructor(client, sourceId, destinationId, namespace, encoding) {
        super();

        this.channel = client.createChannel(sourceId, destinationId, namespace, encoding);
        this.channel.on('message', onmessage);
        this.channel.once('close', onclose);

        var self = this;

        function onmessage(data, broadcast) {
            self.emit('message', data, broadcast);
        }

        function onclose() {
            self.channel.removeListener('message', onmessage);
            self.emit('close');
        }
    }

    send(data) {
        this.channel.send(data);
    }

    close() {
        this.channel.close();
    }
}

module.exports = Controller;