var JsonController = require('./json');

var DEFAULT_INTERVAL = 5; // seconds
var TIMEOUT_FACTOR = 3; // timeouts after 3 intervals

class HeartbeatController extends JsonController {
    constructor(client, sourceId, destinationId) {
        super(client, sourceId, destinationId, 'urn:x-cast:com.google.cast.tp.heartbeat');
        this.pingTimer = null;
        this.timeout = null;
        this.intervalValue = DEFAULT_INTERVAL;

        this.on('message', onmessage);
        this.once('close', onclose);

        var self = this;

        function onmessage(data, broadcast) {
            if (data.type === 'PONG') {
                self.emit('pong');
            }
        }

        function onclose() {
            self.removeListener('message', onmessage);
            self.stop();
        }
    }

    ping() {
        var self = this;

        if (this.timeout) {
            // We already have a ping in progress.
            return;
        }

        this.timeout = setTimeout(function ontimeout() {
            self.emit('timeout');
        }, self.intervalValue * 1000 * TIMEOUT_FACTOR);

        this.once('pong', function onpong() {
            clearTimeout(self.timeout);
            self.timeout = null;

            self.pingTimer = setTimeout(function () {
                self.pingTimer = null;
                self.ping();
            }, self.intervalValue * 1000);
        });

        this.send({type: 'PING'});
    };

    start(intervalValue) {
        var self = this;

        if (intervalValue) {
            this.intervalValue = intervalValue;
        }

        this.ping();
    };

    stop() {
        if (this.pingTimer) {
            clearTimeout(this.pingTimer);
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.removeAllListeners('pong');
    };
}

module.exports = HeartbeatController;