const GameMode  = require('./gamemode.js');
const Stage     = require('./stage.js');
const State     = require('./state.js');

const View      = require('../mvc/view.js');

const Resource  = require('../utilities/resource.js');
const fs            = require('fs');
const Eval          = require('safe-eval');

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
            gmExport.path = a_source;

            var gmLoadPromises = new Array();
            var gmStatePromises = new Array();
            var gmControllerPromises = new Array();
            var gmViewPromises = new Array();

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

                            // -- Load Controllers
                            if(Utils.Valid(loadedState.state.controller.src)) {
                                gmControllerPromises.push(Compiler.LoadController(path, loadedState.state.controller.src, 0).then((loadedController) =>  {
                                    loadedState.state.controller = loadedController.controller;
                                }).catch((a_reason) => {
                                    Debug.Error(a_reason);
                                }));
                            }

                            // -- Load Views
                            for(var l = 0; l < loadedState.state.views.length; l++) {
                                gmViewPromises.push(Compiler.LoadView(path, loadedState.state.views[l], l).then((loadedView) =>  {
                                    console.log(loadedView.view);
                                    loadedState.state.views[loadedView.idx] = loadedView.view;
                                }));
                            }


                            loaded.stage.states[loadedState.idx] = loadedState.state;
                        }).catch((a_reason) => {
                            Debug.Error(a_reason);
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
                    Promise.all(gmViewPromises).then(values => {
                        Promise.all(gmControllerPromises).then(values => {
                            a_callback(gmExport);
                        })
                    })
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
                    if(!Utils.Valid(a_data)) {
                        reject("Could not parse data. Error: " + a_err + ". Data: " + a_data);
                        return;
                    }

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
                    if(!Utils.Valid(a_data)) {
                        reject("Could not parse data. Error: " + a_err + ". Data: " + a_data);
                        return;
                    }

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

    static LoadController(a_path, a_controllerSrc, a_idx) {
        var controllerFunctions = null;
        var controllerPromise = new Promise((resolve, reject) => {
            if(Utils.Valid(a_controllerSrc)) {
                //Load from src
                fs.readFile(a_path + "/" + a_controllerSrc, "utf8", function(a_err, a_data) {
                    //console.log(a_err);
                    controllerFunctions = Eval(a_data, module.exports.CreateContext());
                    //console.log(controllerFunctions);
                    //controllerFunctions.test();
                    //controllerOpts.data = a_data;//JSON.parse(a_data);
    
                    //Call callback on load
                    resolve({controller: controllerFunctions, idx: a_idx});
                });
            } else {
                reject("Invalid controller source: " + a_controllerSrc);
                return;
            }
        });

        return controllerPromise;
    }

    static LoadView(a_path, a_viewSrc, a_idx) {
        var viewOpts = a_viewSrc;
        var viewPromise = new Promise((resolve, reject) => {
            if(Utils.Valid(viewOpts.src)) {
                //Load from src
                fs.readFile(a_path + "/" + viewOpts.src, "utf8", function(a_err, a_data) {
                    viewOpts.data = a_data;//JSON.parse(a_data);
                    //console.log(viewOpts);
                    //Call callback on load
                    resolve({view: new View(viewOpts), idx: a_idx});
                });
            } else {
                //No async was needed, call callback anyway
                resolve({view: new View(viewOpts), idx: a_idx});
            }
        });

        return viewPromise;
    }
}

module.exports.GMCompiler = Compiler