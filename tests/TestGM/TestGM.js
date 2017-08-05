var GameMode = require('../../libs/gamemode.js').GameMode;
var Stage = require('../../libs/stage.js');
var State = require('../../libs/state.js');

class TestGM extends GameMode {
    constructor(a_name) {
        super(a_name);
    }

    reset() {
        super.reset();
        
        // -- Set TestGM Specific Properties
        this.name = "TestGM";

        var introStage = new Stage("Intro Stage");

            var beginState = new State("Begin State");
            introStage.states.push(beginState);

        this.stages.push(introStage);

        var gameStage = new Stage("Game Stage");

            var answerState = new State("Answer State");
            gameStage.states.push(answerState);

            var selectionState = new State("Selection State");
            gameStage.states.push(selectionState);

            var resultsState = new State("Results State");
            gameStage.states.push(resultsState);

        this.stages.push(gameStage);

    }
}

// -- Exports TestGM Class

module.exports = TestGM;