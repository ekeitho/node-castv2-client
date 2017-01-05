var JsonController = require('./json');

class RequestResponseController extends JsonController {
    constructor(client, sourceId, destinationId, namespace) {
        super(client, sourceId, destinationId, namespace);

        this.lastRequestId = 0;
    }

    request(data, callback) {
        var requestId = ++this.lastRequestId;

        var self = this;

        function onmessage(response, broadcast) {
            if (response.requestId === requestId) {
                self.removeListener('message', onmessage);

                if (response.type === 'INVALID_REQUEST') {
                    return callback(new Error('Invalid request: ' + response.reason));
                }

                delete response.requestId;
                callback(null, response);
            }
        }

        this.on('message', onmessage);

        data.requestId = requestId;
        this.send(data);
    };
}


module.exports = RequestResponseController;