/* Internal Dependencies */
var GameMode    = require('../../libs/game/gamemode.js').GameMode;
var Stage       = require('../../libs/game/stage.js');
var State       = require('../../libs/game/state.js');

var View        = require('../../libs/mvc/view.js');

class TestGM extends GameMode {
    constructor(a_name) {
        super(a_name);
        /*this.on("deviceJoined", function(device) {
            console.log("AHHHHH Someone new is hereeee");
        })

        this.on("deviceLeft", function(device) {
            console.log("Phew, they gone");
        })

        this.on("start", function(l) {
            console.log("GM START");
        })*/
    }

    setup() {
        super.setup();
        
        // -- Set TestGM Specific Properties
        this.name = "TestGM";

        var introStage = new Stage("Intro Stage");

            var beginState = new State({ 
                name: "Begin State",
                views: [
                    new View({
                        type: "hub",
                        data: "Welcome to the begin state! Please look at your devices"
                    }),
                    new View({
                        type: "client",
                        role: "a",
                        data: "Welcome to the begin state! You're a client A!"
                    }),
                    new View({
                        type: "client",
                        role: "b",
                        data: "Welcome to the begin state! You're a client B!"
                    })
                ]
            });
            introStage.states.push(beginState);

        this.stages.push(introStage);

        var gameStage = new Stage("Game Stage");

            var answerState = new State({ name : "Answer State" });
            gameStage.states.push(answerState);

            var selectionState = new State({ name : "Selection State" });
            gameStage.states.push(selectionState);

            var resultsState = new State({ name : "Results State" });
            gameStage.states.push(resultsState);

        this.stages.push(gameStage);

    }
}

// -- Exports TestGM Class

module.exports = TestGM;