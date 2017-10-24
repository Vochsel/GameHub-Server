// -- External Dependencies
const EventEmitter = require('events');
const fs = require('fs');
const GHAPI = require('gh-api');

// -- Internal Dependencies
const Debug = require('../utilities/debug.js');
const GH = require('../gamehub.js');

class GameModeManager {

    constructor(a_gmSrc) {
        //this.activeGM = a_gm;
        this.LoadGM(a_gmSrc);

        this.gmms = {
            currentStage: -1,
            currentState: -1,
            currentStageRepeats: -1,
            currentStateRepeats: -1,
            currentFlowIdx: -1
        };

        GH.GMManager = this;
    }

    // -- Load GameMode
    LoadGM(a_src) {
        var pathDir = a_src.split('/');
        var gmName = pathDir[pathDir.length - 1];

        var selfManager = this;

        var gm = new GHAPI.GameMode({
            src: a_src,
            onSetup: () => {
                //gm.debug();
                gm.on("deviceHandshake", (a_device) => {
                    console.log("Hey there");
                    if (!a_device)
                        return;
                    a_device.sendState(gm, selfManager.CurrentStageObject, selfManager.CurrentStateObject);
                });
            },
            onLoad: () => {
                GH.activeGameMode = gm;

                gm.on("deviceHandshake", (a_device) => {
                    console.log("Hey there");
                    if (!a_device)
                        return;
                    a_device.sendState(gm, selfManager.CurrentStageObject, selfManager.CurrentStateObject);
                });

                GH.deviceManager.devices.forEach(function (a_device) {
                    a_device.reset();
                }, this);

                gm.on("stageChange", function (v) {

                    GH.deviceManager.devices.forEach(function (a_device) {
                        if (a_device.shouldRefreshView)
                            a_device.refreshView();
                        if (a_device.shouldResetRole)
                            a_device.reset();
                    }, this);
                });

                this.Start();
                //a_loaded(gm);
                //GH.activeGameMode.start();
            }
        });
        this.activeGM = gm;
        GH.activeGameMode = this.activeGM;
    }

    // -- Progress

    LoadProgress(a_progress) {
        this.gmms = JSON.parse(a_progress);
    }

    SaveProgress() {
        return JSON.stringify(this.gmms);
    }

    // -- GM Control

    Start() {
        console.log("Starting");
        //this.gmms.currentStage = 0;
        this.gmms.currentState = 0;

        this.gmms.currentStageRepeats = 0;
        this.gmms.currentStateRepeats = 0;
        this.gmms.currentFlowIdx = 0;

        this.SetStage(0);
    }

    Stop() {

    }

    // -- Nexters

    NextStage() {
        //Check stage repetitions
        if (this.gmms.currentStageRepeats < (this.activeGM.flow[this.gmms.currentFlowIdx].repeats - 1)) {
            this.RepeatStage();
            return false;
        }

        //Go to next stage
        if((this.gmms.currentFlowIdx + 1) >= this.activeGM.flow.length) {
            this.Stop();
            return false;
        }

        var nextFlowName = this.activeGM.flow[this.gmms.currentFlowIdx + 1].stage;
        var nextFlowIdx = this.activeGM.getStageIdxByName(nextFlowName);

        this.gmms.currentFlowIdx += 1;

        //Reset number of stage repeats
        this.gmms.currentStageRepeats = 0;

        if (!this.SetStage(nextFlowIdx)) {
            this.Stop();
            return false;
        }

        return true;
    }

    NextState() {
        if (!this.SetState(this.gmms.currentState + 1)) {
            this.NextStage();
        }
    }

    RepeatStage() {
        console.log("Repeating Stage");

        this.gmms.currentStageRepeats += 1;
        this.SetStage(this.gmms.currentStage);
    }

    RepeatState() {
        console.log("Repeating State");

        this.gmms.currentStateRepeats += 1;
        this.SetStage(this.gmms.currentState);
    }

    // -- Setters

    SetStage(a_idx) {
        //Check if a_idx exists
        if (a_idx < 0 && a_idx >= this.activeGM.stages.length) {
            console.error("Stage index out of bounds");
            return false;
        }

        //Exit old stage if valid
        if (this.ValidCurrentStage)
            this.CurrentStageObject.exit();

        GH.deviceManager.devices.forEach(function (a_device) {
            if (a_device.shouldResetRole)
                a_device.reset();
        }, this);

        

        //Set currentStage variable
        this.gmms.currentStage = a_idx;

        //Enter new stage
        this.CurrentStageObject.enter();

        this.gmms.currentState = 0;

        GH.deviceManager.devices.forEach(function (a_device) {
            a_device.refreshView();
        }, this);

        return true;
    }

    SetState(a_idx) {
        if (a_idx < 0 && a_idx >= this.CurrentStageObject.states.length) {
            console.error("State index out of bounds");
            return false;
        }

        if (this.ValidCurrentState)
            this.CurrentStateObject.exit();

        GH.deviceManager.devices.forEach(function (a_device) {
            if (a_device.shouldResetRole)
                a_device.reset();
        }, this);

        this.gmms.currentStateRepeats = 1;

        this.gmms.currentState = a_idx;

        if(!this.ValidCurrentState)
            return false;
        
        this.CurrentStateObject.enter();

        GH.deviceManager.broadcastState(this.activeGM, this.CurrentStageObject, this.CurrentStateObject);

        return true;
    }

    // -- Getters

    get ValidCurrentStage() {
        return this.gmms.currentStage >= 0 && this.gmms.currentState < this.activeGM.stages.length;
    }

    get ValidCurrentState() {
        return this.gmms.currentState >= 0 && this.gmms.currentState < this.CurrentStageObject.states.length;
    }

    get CurrentStageObject() {
        return this.activeGM.getStage(this.gmms.currentStage);
    }

    get CurrentStateObject() {
        return this.activeGM.getStage(this.gmms.currentStage).getState(this.gmms.currentState);
    }

}

module.exports = GameModeManager;