/* Internal Dependencies */
var GameMode    = require('../../libs/game/gamemode.js').GameMode;
var Stage       = require('../../libs/game/stage.js');
var State       = require('../../libs/game/state.js');

var View        = require('../../libs/mvc/view.js');

const GH        = require('../../libs/gamehub.js');

class TestGM extends GameMode {
    constructor(a_name) {
        super(a_name);
    }

    setup() {
        super.setup();
        
        // -- Set TestGM Specific Properties
        this.name = "TestGM";
        this.version = "0.1.1";

        var introStage = new Stage("Intro Stage");
            var beginState = new State({ 
                name: "Begin State",
                isValidated: function() {
                    var readyClients = Object.keys(this.model.clientsReady).length;
                    var numOfClients = GH.deviceManager.getAllDevicesOfType("client").length;

                    console.log(readyClients + " : " + numOfClients);
                    
                    return readyClients >= numOfClients;
                },
                model: {
                    x: 10,
                    clientsReady: {}
                },
                controller: {
                    clientIsReady: function(a_device) {
                        beginState.model.clientsReady[a_device.uid] = "ready";
                        console.log(beginState.model.clientsReady);
                    }
                },
                views: [
                    new View({
                        type: "hub",
                        data: "Welcome to {gm.name}.<br>Version: {gm.version}<br>Welcome to the begin state! Please look at your devices"
                    }),
                    new View({
                        type: "client",
                        role: "a",
                        data: "Welcome to {state.x} the begin state! You're a client {stage.y}A!<br><input data-value='clientIsReady()' type='button' value='Continue'/>"
                    }),
                    new View({
                        type: "client",
                        role: "b",
                        data: "Welcome to the begin state! {stage.y} You're a client B{state.x}!<br><input data-value='clientIsReady()' type='button' value='Continue'/>"
                    })
                ]
            });
            introStage.states.push(beginState);

        this.stages.push(introStage);

        var gameStage = new Stage("Game Stage");

            var answerState = new State({ 
                name : "Answer State",
                controller: {
                    changeRoleA: function(a_device) {
                        a_device.role = "a";

                        a_device.shouldRefreshView = true; //TODO: Maybe just make these return true?
                    },
                    changeRoleB: function(a_device) {
                        a_device.role = "b";

                        a_device.shouldRefreshView = true;
                    }
                },
                views: [
                    new View({
                        type: "hub",
                        data: "<h1>Answer State!</h1>"
                    }),
                    new View({
                        type: "client",
                        role: "a",
                        data: "Enter Answer! Role A! <input type='button' data-value='changeRoleB()' value='Change to role B'/>"
                    }),
                    new View({
                        type: "client",
                        role: "b",
                        data: "Enter Answer! Role B! <input type='button' data-value='changeRoleA()' value='Change to role A'/>"
                    })
                ]
            });
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