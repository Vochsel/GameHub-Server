const EventEmitter = require('events');

const Debug = require('../debug.js');

class DeviceManager {

    // -- Constructor
    constructor() {
        //Create device map
        this.devices = new Map();

        //Start device status checker
        var self = this;
        setInterval(function validateDevices() { 

            //Loop through all devices and check status
            self.devices.forEach(function(element) {
                element.checkStatus();
            }, self);

        }, 3000);
    }

    // -- Add device
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

    // -- Remove device by uid
    removeDevice(a_uid) {
        //Remove Device
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

    recieveMessage(a_message) {
        Debug.Log("[GH DM] " + a_message, "blue");
    }

    //Check if device is alive
    checkStatus() {
        if(this.socket.isAlive === false) return this.socket.terminate();

        this.socket.isAlive = false;
        this.socket.ping('', false, true);
    }
}

module.exports = DeviceManager;