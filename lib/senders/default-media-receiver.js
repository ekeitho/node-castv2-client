var Application = require('./application');
var MediaController = require('../controllers/media');

class DefaultMediaReceiver extends Application {
    constructor(client, session) {
        super(client, session);
        this.media = this.createController(MediaController);

        this.media.on('status', onstatus);

        var self = this;

        function onstatus(status) {
            self.emit('status', status);
        }
    }

    getStatus(callback) {
        this.media.getStatus.apply(this.media, arguments);
    };

    load(media, options, callback) {
        this.media.load.apply(this.media, arguments);
    };

    play(callback) {
        this.media.play.apply(this.media, arguments);
    };

    pause(callback) {
        this.media.pause.apply(this.media, arguments);
    };

    stop(callback) {
        this.media.stop.apply(this.media, arguments);
    };

    seek(currentTime, callback) {
        this.media.seek.apply(this.media, arguments);
    };

    queueLoad(items, options, callback) {
        this.media.queueLoad.apply(this.media, arguments);
    };

    queueInsert(items, options, callback) {
        this.media.queueInsert.apply(this.media, arguments);
    };

    queueRemove(itemIds, options, callback) {
        this.media.queueRemove.apply(this.media, arguments);
    };

    queueReorder(itemIds, options, callback) {
        this.media.queueReorder.apply(this.media, arguments);
    };

    queueUpdate(items, callback) {
        this.media.queueUpdate.apply(this.media, arguments);
    };
}

DefaultMediaReceiver.APP_ID = 'CC1AD845';

module.exports = DefaultMediaReceiver;
