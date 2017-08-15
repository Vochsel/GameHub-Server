const GameMode  = require('./gamemode.js');
const Stage     = require('./stage.js');
const State     = require('./state.js');

const View      = require('../mvc/view.js');

const Resource  = require('../utilities/resource.js');

const GHub      = require('../gamehub.js');

const Debug      = require('../utilities/debug.js');

module.exports.CreateContext = function() {
    return {
        GH: {
            GameMode: GameMode.GameMode,
            Stage: Stage,
            State: State,
            
            View: View,

            Resource: Resource,

            System: {
                deviceManager: GHub.deviceManager,
                serverManager: GHub.serverManager,
            }
        },
        console: console,
        Debug: Debug
    }
}