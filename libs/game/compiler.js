const GameMode  = require('./gamemode.js');
const Stage     = require('./stage.js');
const State     = require('./state.js');

const View      = require('../mvc/view.js');

const Resource  = require('../utilities/resource.js');
const fs            = require('fs');

const GHub      = require('../gamehub.js');

const Debug      = require('../utilities/debug.js');
const Utils      = require('../utilities/utils.js');

module.exports.CreateContext = function() {
    return {
        GH: {
            GameMode: GameMode,
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
        Debug: Debug,
        Utils: Utils
    }
}

class GameHubCompiler {
    static compile(a_source) {
        fs.readFile(a_source, function(a_err, a_data) {
            var gmSource = JSON.parse(a_data);

            //Load meta

            //Load model

            //Load controllers
            
            //Load models
            
        });
    }
}