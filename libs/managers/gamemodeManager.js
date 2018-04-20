// -- External Dependencies
const EventEmitter = require('events');
const fs = require('fs');
const GHAPI = require('gh-api');
const unzip = require('unzip');

// -- Internal Dependencies
const Debug = GHAPI.Debug;
const GH = require('../gamehub.js');

class GameModeManager {

    constructor(a_gmSrc, a_gmms) {
        
        this.gmms = {
            currentStage: -1,
            currentState: -1,
            currentStageRepeats: -1,
            currentStateRepeats: -1,
            currentFlowIdx: -1
        };

        this.isReload = false;

        if(a_gmms) {
            console.log("Using gmms");
            //this.LoadProgress(a_gmms);
                this.isReload = true;            
                this.gmms = a_gmms;
                
            //this.LoadProgress(a_gmms);
        }
        if(a_gmSrc.includes(".zip"))
            this.LoadGMZip(a_gmSrc);
        else
            this.LoadGM(a_gmSrc, (gm) => {
                if(this.isReload) {
                    this.LoadProgress(this.gmms);
                
                    this.SetStage(this.gmms.currentStage, false);
                    this.SetState(this.gmms.currentState, true);
                }
                else {
                    
                    //Still need this?
                    GH.deviceManager.devices.forEach(function (a_device) {
                        a_device.reset();
                    }, this);


                    gm.Start();
                }
            });

     

        GH.GMManager = this;
    }

    LoadGMZip(a_zipPath) {
        var uz = fs.createReadStream(a_zipPath).pipe(unzip.Extract({ path: 'gamemodes/temp/' }));
    }

    // -- Load GameMode
    LoadGM(a_src, a_callback) {
        var pathDir = a_src.split('/');
        var gmName = pathDir[pathDir.length - 1];

        var selfManager = this;

        var gm = new GHAPI.GameMode({
            src: a_src,
            onLoad: () => {
                console.log("HEEYEYEY")
                /*if(selfManager.isReload) {
                    console.log("Relading");
                    selfManager.LoadProgress(selfManager.gmms);
                    GH.deviceManager.devices.forEach(function (a_device) {
                        a_device.refreshView();
                    }, this);
                }*/

                GH.activeGameMode = gm;

                gm.on("deviceHandshake", (a_device) => {
                    if (!a_device)
                        return;
                    a_device.sendState(gm, selfManager.CurrentStageObject, selfManager.CurrentStateObject);
                });

                /*GH.deviceManager.devices.forEach(function (a_device) {
                    a_device.reset();
                }, this);*/

                gm.on("stageChange", function (v) {

                    GH.deviceManager.devices.forEach(function (a_device) {
                        if (a_device.shouldRefreshView)
                            a_device.refreshView();
                        if (a_device.shouldResetRole)
                            a_device.reset();
                    }, this);
                });

                a_callback(this);

               // if(!selfManager.isReload)
               //     this.Start();
            }
        });
        this.activeGM = gm;
        GH.activeGameMode = this.activeGM;

        GHAPI.Utils.GH_API.GH.GMManager = this;
    }

    // -- Progress

    LoadProgress(a_progress) {
        console.log("Loading Progress");
        if(GHAPI.Utils.IsString(a_progress))
            this.gmms = JSON.parse(a_progress);
        else
            this.gmms = a_progress;

        this.CurrentStageObject.model = this.gmms.currentStageModel;
        this.CurrentStateObject.model = this.gmms.currentStateModel;
        this.activeGM.model           = this.gmms.currentGMModel;
      //  console.log(this.gmms);
    }

    SaveProgress() {
        console.log("Saving Progress");
        this.gmms.currentStageModel = this.CurrentStageObject.model;
        this.gmms.currentStateModel = this.CurrentStateObject.model;
        this.gmms.currentGMModel    = this.activeGM.model;
        return this.gmms;
      //  console.log(this.gmms);
        //return JSON.stringify(this.gmms);
    }

    // -- GM Control

    Start() {
        this.gmms.currentStageRepeats = 0;
        this.gmms.currentStateRepeats = 0;
        this.gmms.currentFlowIdx = 0;

        this.SetStage(0);
    }

    Refresh() {
        this.SetStage(this.gmms.currentStage);
    }

    Stop() {

    }

    Progress() {
        this.NextState();
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

    SetStage(a_idx, a_shouldTransition = true) {
        //Check if a_idx exists
        if (a_idx < 0 && a_idx >= this.activeGM.stages.length) {
            console.error("Stage index out of bounds");
            return false;
        }

        if(a_shouldTransition) {
            //Exit old stage if valid
            if (this.ValidCurrentStage)
                this.CurrentStageObject.exit();

            GH.deviceManager.devices.forEach(function (a_device) {
                if (a_device.shouldResetRole)
                    a_device.reset();
            }, this);
        }        

        //Set currentStage variable
        this.gmms.currentStage = a_idx;
        
        if(a_shouldTransition) {
            //Enter new stage
            this.CurrentStageObject.enter();
            
            //@TODO: Temp fix, gm was exiting state because last stage didnt reset it... 
            this.gmms.currentState = -1;
    
            //Set to first state
            this.SetState(0);
        }

        GH.deviceManager.devices.forEach(function (a_device) {
            a_device.refreshView();
        }, this);

        return true;
    }

    SetState(a_idx, a_shouldTransition = true) {
        if (a_idx < 0 && a_idx > this.CurrentStageObject.states.length) {
            console.error("State index out of bounds");
            return false;
        }

        if(a_shouldTransition) {
            //Call exit callback on currently exited state
            if (this.ValidCurrentState){
                this.CurrentStateObject.exit();
            }
                
            GH.deviceManager.devices.forEach(function (a_device) {
                if (a_device.shouldResetRole)
                a_device.reset();
            }, this);

            this.gmms.currentStateRepeats = 1;
        }

        this.gmms.currentState = a_idx;

        if(!this.ValidCurrentState)
            return false;
        
        if(a_shouldTransition) {
            //Call enter callback on newly entered state
            this.CurrentStateObject.enter();
        }

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