const EventEmitter = require('events');

const Debug = require('./debug.js');

const Message = require('./message.js');

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
    }

    sendMessage(a_message) {
        this.socket.send(a_message);
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
        Debug.SetLogPrefix("DM");

        switch(m.type) {
            case "handshake": {
                a_device.type = m.data.type;
                a_device.role = m.data.role;

                Debug.Log("Recieved device handshake!", "blue");
                Debug.Log(" - Device Type: " + a_device.type + ".", "blue");
                Debug.Log(" - Device Role: " + a_device.role + ".", "blue");
            }
            break;
        }

        Debug.ResetLogPrefix();
    }
}

module.exports = Device;