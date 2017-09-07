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

class Compiler {
    static Compile(a_source, a_callback) {
        var path = a_source;

        var pathDir = path.split('/');
        var gmName = pathDir[pathDir.length - 1];

        var gmPath = path + "/" + gmName + ".json";
        fs.readFile(gmPath, "utf8", function(a_err, a_data) {
            var gmSource = JSON.parse(a_data);

            var gmExport = new GameMode(gmSource);

            var gmLoadPromises = new Array();
            var gmStatePromises = new Array();

            //Load meta

            //Load model

            // -- Load stages
            var stages = gmSource.stages;

            //Loop through all stages and load
            for(var i = 0; i < stages.length; i++) {
                //Load stage and push promise into gmLoadPromises
                gmLoadPromises.push(Compiler.LoadStage(path, stages[i], i).then((loaded) =>  {
                    // -- Load States
                    for(var j = 0; j < loaded.stage.states.length; j++) {
                        gmStatePromises.push(Compiler.LoadState(path, loaded.stage.states[j], j).then((loadedState) =>  {
                            loaded.stage.states[loadedState.idx] = loadedState.state;
                        }));
                    }

                    //Store stage
                    gmExport.stages[loaded.idx] = loaded.stage;
                    //gmExport.stages.push(loaded.stage);
                }));
            }
            

            // -- Call final callback
            Promise.all(gmLoadPromises).then(values => {
                Promise.all(gmStatePromises).then(values => {
                    a_callback(gmExport);
                });
            });

            return gmExport;
        });
    }

    static LoadModel(a_modelSrc) {

    }

    static LoadStage(a_path, a_stageSrc, a_idx) {
        var stageOpts = a_stageSrc;
        var stagePromise = new Promise((resolve, reject) => {
            if(Utils.Valid(stageOpts.src)) {
                //Load from src
                fs.readFile(a_path + "/" + stageOpts.src, "utf8", function(a_err, a_data) {
                    stageOpts = JSON.parse(a_data);

                    //Call callback on load
                    resolve({stage: new Stage(stageOpts), idx: a_idx});
                });
            } else {
                //No async was needed, call callback anyway
                resolve({stage: new Stage(stageOpts), idx: a_idx});
            }
        });

        return stagePromise;
    }

    static LoadState(a_path, a_stateSrc, a_idx) {
        var stateOpts = a_stateSrc;
        var statePromise = new Promise((resolve, reject) => {
            if(Utils.Valid(stateOpts.src)) {
                //Load from src
                fs.readFile(a_path + "/" + stateOpts.src, "utf8", function(a_err, a_data) {
                    stateOpts = JSON.parse(a_data);
    
                    //Call callback on load
                    resolve({state: new State(stateOpts), idx: a_idx});
                });
            } else {
                //No async was needed, call callback anyway
                resolve({state: new State(stateOpts), idx: a_idx});
            }
        });

        return statePromise;
    }

    static LoadController(a_controllerSrc) {
        
    }

    static LoadView(a_viewSrc) {
        
    }
}

module.exports.GMCompiler = Compiler