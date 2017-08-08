const EventEmitter = require('events');

const Debug = require('../debug.js');

class DeviceManager {
    constructor() {
        this.devices = new Map();
    }

    addDevice(a_uid, a_remoteAddress, a_socket) {
        //Create new device
        //var newDevice = new Device(a_uid, a_remoteAddress, a_socket);
        var newDevice = new Device(a_socket);

        var uid = this.devices.size;

        //Push new device into device array
        this.devices.set(uid /*newDevice.uid*/, newDevice);

        Debug.Log("Device added. UID: " + uid, "blue");

        //Return new device for external reference
        return newDevice;
    }

    removeDevice(a_uid) {

    }

    // -- Emit to specific device with id
    emit(a_uid, a_message) {
        //Get reference to device
        var device = this.devices.get(a_uid);

        //Device does not exist
        if(!device) {
            Debug.Error("Could not find device with uid: " + a_uid);
            return;
        }

        //Send message to device
        device.sendMessage(a_message);
    }

    // -- Emit to all connected devices
    broadcast(a_message) {
        this.devices.array.forEach(function(device) {
            //Send message to device
            device.sendMessage(a_message);
        }, this);
    }

    // -- Callback on recieve client message
    /*recieve(a_socket, a_message) {

    }*/
}

class Device extends EventEmitter {
    constructor(a_socket) {
        super();

        //Store reference to client socket
        this.socket = a_socket;
        
        //Client IP address
        this.clientIP = this.socket._socket.remoteAddress;

        //Device unique ID
        this.uid = this.clientIP;
    }

    sendMessage(a_message) {
        this.socket.send(a_message);
    }
}

module.exports = DeviceManager;