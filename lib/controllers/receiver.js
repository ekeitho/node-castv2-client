var RequestResponseController = require('./request-response');

class ReceiverController extends RequestResponseController {
    constructor(client, sourceId, destinationId) {
        super(client, sourceId, destinationId, 'urn:x-cast:com.google.cast.receiver');
        this.on('message', onmessage);
        this.once('close', onclose);

        var self = this;

        function onmessage(data, broadcast) {
            if (!broadcast) return;
            if (data.type === 'RECEIVER_STATUS') {
                self.emit('status', data.status);
            }
        }

        function onclose() {
            self.removeListener('message', onmessage);
        }
    }

    getStatus(callback) {
        this.request({type: 'GET_STATUS'}, function (err, response) {
            if (err) return callback(err);
            callback(null, response.status);
        });
    };

    getAppAvailability(appId, callback) {
        var data = {
            type: 'GET_APP_AVAILABILITY',
            appId: Array.isArray(appId) ? appId : [appId]
        };

        this.request(data, function (err, response) {
            if (err) return callback(err);
            callback(null, response.availability);
        });
    };

    launch(appId, callback) {
        this.request({type: 'LAUNCH', appId: appId}, function (err, response) {
            if (err) return callback(err);
            if (response.type === 'LAUNCH_ERROR') {
                return callback(new Error('Launch failed. Reason: ' + response.reason));
            }
            callback(null, response.status.applications || []);
        });
    };

    stop(sessionId, callback) {
        this.request({type: 'STOP', sessionId: sessionId}, function (err, response) {
            if (err) return callback(err);
            callback(null, response.status.applications || []);
        });
    };

    setVolume(options, callback) {
        var data = {
            type: 'SET_VOLUME',
            volume: options // either `{ level: 0.5 }` or `{ muted: true }`
        };

        this.request(data, function (err, response) {
            if (err) return callback(err);
            callback(null, response.status.volume);
        });
    };

    getVolume(callback) {
        this.getStatus(function (err, status) {
            if (err) return callback(err);
            callback(null, status.volume);
        });
    };

    getSessions(callback) {
        this.getStatus(function (err, status) {
            if (err) return callback(err);
            callback(null, status.applications || []);
        });
    };
}

module.exports = ReceiverController;
