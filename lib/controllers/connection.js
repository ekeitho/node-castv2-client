var JsonController = require('./json');

class ConnectionController extends JsonController {
    constructor(client, sourceId, destinationId) {
        super(client, sourceId, destinationId, 'urn:x-cast:com.google.cast.tp.connection');

        this.on('message', onmessage);
        this.once('close', onclose);

        var self = this;

        function onmessage(data, broadcast) {
            if (data.type === 'CLOSE') {
                self.emit('disconnect');
            }
        }

        function onclose() {
            self.removeListener('message', onmessage);
        }
    }

    connect() {
        this.send({type: 'CONNECT'});
    }

    disconnect() {
        this.send({type: 'CLOSE'});
    }
}


module.exports = ConnectionController;