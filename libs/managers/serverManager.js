/* External Dependencies */
const Express = require('express');
const WebSocketServer = require('ws').Server;

/* Internal Dependencies */
const GH = require('../gamehub.js');
const Debug     = require('gh-api').Debug;
const Message = require('../utilities/message.js');
const DeviceManager = require('./deviceManager.js');

class ServerManager {
    constructor() {
        //Server Config
        this.PORT = 3000;

        /* ---------- Express ---------- */

        //Create express application
        this.application = Express();

        //Serve public folder
        this.application.use(Express.static(__dirname + '/../../public'));

        //Create Express Server
        var self = this;
        this.webServer = this.application.listen(this.PORT, function () {
            Debug.Log("[GH Web Server] Server running on port: " + self.PORT, "yellow");
            self = null;
        });

        /* --------- WS Server --------- */

        this.socketServer = new GHSocketServer({ server: this.webServer, deviceManager: this.deviceManager });

    }

}

// -- Dedicated GameHub Web Socket Server
class GHSocketServer extends WebSocketServer {
    constructor(a_options, a_cb) {

        //Call WebSocketServer super
        super(a_options, a_cb);

        // -- Assign Event Callbacks

        //WSS has started listening
        this.on('listening', function () {
            Debug.Log("[GH Socket Server] Server listening", "yellow");

        });

        //On Socket Error
        this.on("error", function (a_err) {
            Debug.Log("[GH Socket Server] Server error", "yellow");
            Debug.Log("[GH Web Server] " + a_err, "yellow");
        })

        //Client has connected
        this.on('connection', function (a_socket) {
            Debug.Log("[GH Socket Server] New connection", "yellow");

            a_socket.on('message', function (a_msg) {
                GHSocketServer.RecieveMessage(a_socket, a_msg);
            });

            /*a_socket.on('close', function(a_evt) {
                newDevice.emit("leave");
                GH.activeGameMode.emit("deviceLeft", newDevice);

                Debug.Log("Connection closed, removing device", "yellow");
                GH.deviceManager.removeDevice(newDevice);
            })*/

            //Set socket is alive
            a_socket.isAlive = true;

            //Setup pong function to check if alive
            a_socket.on('pong', function (s) {
                a_socket.isAlive = true;
            });
        });
    }

    //Handler when socket server recieves message
    static RecieveMessage(a_socket, a_message) {
        var m = Message.parse(a_message);

        var device = a_socket.attachedDevice;

        switch (m.type) {
            case "handshake": {
                var opts = {};

                if (m.data.type) opts.type = m.data.type;   else opts.type = "default";
                if (m.data.role) opts.role = m.data.role;   else opts.role = "default";
                if (m.data.name) opts.name = m.data.name;
                if (m.data.uid) opts.uid = m.data.uid;
                
                if (a_socket) opts.socket = a_socket;

                var newDevice = GH.deviceManager.addDevice(opts);
                newDevice.emit("join");

                a_socket.attachedDevice = newDevice;

                GH.activeGameMode.emit("deviceJoined", newDevice);
                GH.activeGameMode.emit("deviceHandshake", newDevice);

                Debug.SetLogPrefix("Device Manager");
                Debug.Log("Recieved device (UID: " + newDevice.uid + ") handshake!", "blue");
                Debug.Log(" - Device Type: " + newDevice.type + ".", "blue");
                Debug.Log(" - Device Role: " + newDevice.role + ".", "blue");
                Debug.Log(" - Device Name: " + newDevice.name + ".", "blue");
                Debug.ResetLogPrefix();
                break;
            }
            case "controller": {
                //Precheck 
                if (!m.data)
                    return;

                var action = m.data.action;
                var data = m.data.data;

                //Recieved function to call
                Debug.Log("[Device Manager] Recieved controller function: " + action + ". Executing!", "blue");

                //Call desired function
                //TODO: Add some kind of check?
                //var funcToCall = GH.activeGameMode.currentStage.currentState.controller[action];

                //var funcToCall = GH.activeGameMode.currentStage.currentState.getControllerFunction(action);
                var funcToCall = GH.GMManager.CurrentStateObject.getControllerFunction(action);
                if (funcToCall) {
                    //TODO: maybe move this??
                    //funcToCall.func.call(GH.activeGameMode.currentStage.currentState, device, data);
                    funcToCall.func.call(funcToCall.controller, device, data);


                    //Moved these to only get called when func is found
                    //Refresh device's view if needed
                    if (device.shouldRefreshView) {
                        device.refreshView();
                        device.shouldRefreshView = false;
                    }

                    //GH.activeGameMode.isValidated();
                    if (GH.GMManager.CurrentStateObject.isValidated()) {
                        Debug.Log("Progressing");
                        GH.GMManager.NextState();
                        //this.progressGameMode();
                    }
                } else {
                    Debug.Error("[Device Manager] No function found in state controller with declaration: " + action);
                }

            }
                break;
        }

        Debug.ResetLogPrefix();
    }
}

module.exports = ServerManager;
