/* External Dependencies */
const EventEmitter  = require('events');

/* Internal Dependencies */
const Debug         = require('./debug.js');
const Message       = require('./message.js');
const GH            = require('../gamehub.js');

class Device extends EventEmitter {
    constructor(a_socket) {
        super();

        //Store reference to client socket
        this.socket = a_socket;
        
        //Client IP address
        this.clientIP = this.socket._socket.remoteAddress;

        //Type of device, this determines which view it will recieve
        this.type = "default";

        //Role of device, determines which sub view device will get
        this.role = "default";

        //Device unique ID
        this.uid = this.clientIP;

        //Should device refresh view
        this.shouldRefreshView = false;
    }

    sendMessage(a_message) {
        this.socket.send(a_message);
    }

    //TODO: Doesnt make sense to call function this and take a string
    sendView(a_string) {
        this.sendMessage(new Message("view", a_string).stringify());
        Debug.Log("[Device] Sent view", "blue");
    }

    //Check if device is alive
    checkStatus() {
        if(this.socket.isAlive === false) {
            this.socket.terminate();
            return false;
        }

        this.socket.isAlive = false;
        this.socket.ping('', false, true);
        return true;
    }

    static recieveMessage(a_device, a_message) {
        var m = Message.parse(a_message);
        Debug.SetLogPrefix("Device Manager");

        switch(m.type) {
            case "handshake": {
                if(m.data.type) a_device.type = m.data.type;
                if(m.data.role) a_device.role = m.data.role;

                Debug.Log("Recieved device (UID: " + a_device.uid + ") handshake!", "blue");
                Debug.Log(" - Device Type: " + a_device.type + ".", "blue");
                Debug.Log(" - Device Role: " + a_device.role + ".", "blue");
                GH.activeGameMode.emit("deviceHandshake", a_device);
            }
            break;
            case "controller": {
                //Precheck 
                if(!m.data)
                    return;

                //Recieved function to call
                Debug.Log("Recieved controller function: " + m.data + ". Executing!", "blue");
                
                //Call desired function
                //TODO: Add some kind of check?
                var funcToCall = GH.activeGameMode.currentStage.currentState.controller[m.data];
                if(funcToCall) {
                    funcToCall(a_device);
                } else {
                    Debug.Error("No function found in state controller with declaration: " + m.data);
                }

                //Refresh device's view if needed
                if(a_device.shouldRefreshView) {
                    GH.activeGameMode.currentStage.currentState.execute(a_device);
                    a_device.shouldRefreshView = false;
                }

                GH.activeGameMode.isValidated();
            }
            break;
        }

        Debug.ResetLogPrefix();
    }
}

module.exports = Device;