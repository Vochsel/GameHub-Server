// -- External Dependencies
const EventEmitter = require('events');
const fs = require('fs');
const GHAPI = require('gh-api');

// -- Internal Dependencies
const Debug = require('../utilities/debug.js');
const GH = require('../gamehub.js');


class GameManager extends EventEmitter {
    constructor() {
        super();

        this.activeGameMode = null;
    }

    static reloadActiveGameMode() {
        GameManager.loadGameMode(GH.activeGameMode.path);
    }

    static loadGameMode(a_path, a_loaded) {

        var pathDir = a_path.split('/');
        var gmName = pathDir[pathDir.length - 1];

        var gm = new GHAPI.GameMode({
            src: a_path,
            onSetup: () => {
                //gm.debug();
                gm.on("deviceHandshake", (a_device) => {
                    if (!a_device)
                        return;
                    a_device.sendState(GH.activeGameMode, GH.GMManager.CurrentStageObject, GH.GMManager.CurrentStateObject);
                });
            },
            onLoad: () => {
                GH.activeGameMode = gm;

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

                for (var i = 0; i < gm.stages.length; i++) {
                    for(var j = 0; j < gm.stages[i].states.length; j++) {
                        gm.stages[i].states[j].on("exit", function(state) {
                            
                        })
                    }
                    gm.stages[i].on("exit", function(state) {
                        
                    });

                    gm.stages[i].on("stateChange", function (state) {
                        GH.deviceManager.devices.forEach(function (a_device) {
                            //console.log(a_device.role);
                            
                            //console.log(a_device.name + " : " + a_device.shouldResetRole);
                            //if (a_device.shouldRefreshView)
                            //    a_device.refreshView();
                            if (a_device.shouldResetRole)
                                a_device.reset();
                            //console.log(a_device.name + " : " + a_device.shouldResetRole);
                            //console.log(a_device.role);
                        }, this);
                        
                        GH.deviceManager.broadcastState(state, gm);
                    });
                }

                a_loaded(gm);
                //GH.activeGameMode.start();
            }
        });

        return gm;
    }

    static Manage(a_gamemode) {
        
    }
}



module.exports = GameManager;