const EventEmitter = require('events');

const Debug = require('../debug.js');

class GameManager extends EventEmitter {
    constructor() {
        super();

        this.activeGameMode = null;
    }


}