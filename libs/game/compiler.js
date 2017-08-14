const GameMode  = require('./gamemode.js');
const Stage     = require('./stage.js');
const State     = require('./state.js');

const View      = require('../mvc/view.js');

module.exports.Context = {
    GH: {
        GameMode: GameMode.GameMode,
        Stage: Stage,
        State: State,
        View: View
    },
    console: console
}