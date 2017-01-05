var Controller = require('./controller');

class JsonController extends Controller {
    constructor(client, sourceId, destinationId, namespace) {
        super(client, sourceId, destinationId, namespace, 'JSON');
    }
}

module.exports = JsonController;