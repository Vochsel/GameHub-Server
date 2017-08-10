/* External Dependencies */
const EventEmitter  = require('events');

/* Internal Dependencies */
const Debug         = require('../utilities/debug.js');
const Message       = require('../utilities/message.js');
const Device        = require('../utilities/device.js');

class DeviceManager {

    // -- Constructor
    constructor() {
        //Create device map
        this.devices = new Map();

        //Start device status checker
        var self = this;
        setInterval(function validateDevices() { 

            //Loop through all devices and check status
            self.devices.forEach(function(device, key) {
                var isAlive = device.checkStatus();
                if(!isAlive) self.removeDevice(key);
            }, self);

        }, 3000);
    }

    // -- Add device
    addDevice(a_uid, a_remoteAddress, a_socket) {
        //Create new device
        //var newDevice = new Device(a_uid, a_remoteAddress, a_socket);
        var newDevice = new Device(a_socket);

        var uid = this.devices.size;
        newDevice.uid = uid;

        //Push new device into device array
        this.devices.set(uid /*newDevice.uid*/, newDevice);

        Debug.Log("Device added. UID: " + uid, "blue");

        //Return new device for external reference
        return newDevice;
    }

    // -- Remove device by devices key
    removeDevice(a_device) {
        //a_device is a key
        if(typeof a_device === 'string') {
            //If devices has key
            if(this.devices.has(a_device)) {
                //Delete
                Debug.Log("Removing device by key", "blue");
                return this.devices.delete(a_device);
            }
        }

        //Otherwise loop all and check
        this.devices.forEach(function(device, key) {
            //a_device is uid
            if(typeof a_device === 'number') {
                if(device.uid === a_device) {
                    Debug.Log("Removing device by UID", "blue");
                    return this.devices.delete(key);  
                }
            } else if (typeof a_device === 'object') {
                if(device === a_device) {
                    Debug.Log("Removing device by reference", "blue");
                    return this.devices.delete(key);
                }
            }
        }, this);
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

module.exports = DeviceManager;