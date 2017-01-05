var Sender = require('./sender');
var ConnectionController = require('../controllers/connection');


function randomSenderId() {
    return 'client-' + Math.floor(Math.random() * 10e5);
}

class Application extends Sender {
    constructor(client, session) {
        super(client, randomSenderId(), session.transportId);

        this.session = session;

        this.connection = this.createController(ConnectionController);
        this.connection.connect();

        this.connection.on('disconnect', ondisconnect);
        this.on('close', onclose);

        var self = this;

        function ondisconnect() {
            self.emit('close');
        }

        function onclose() {
            self.removeListener('close', onclose);
            self.connection.removeListener('disconnect', ondisconnect);
            self.connection.close();
            self.connection = null;
            self.session = null;
            Sender.prototype.close.call(this);
        }
    }

    close() {
        this.connection.disconnect();
        this.emit('close');
    };
}

module.exports = Application;