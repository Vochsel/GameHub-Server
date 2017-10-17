/* External Dependencies */
const EventEmitter  = require('events');

/* Internal Dependencies */
const GH                = require('../gamehub.js');
const Debug         = require('../utilities/debug.js');
const Message       = require('../utilities/message.js');
//const Device        = require('../utilities/device.js');
const Device = require('gh-api').Device;


class DeviceManager {

    // -- Constructor
    constructor() {
        //Create device map
        //TODO: Does this really need to be a map?
        this.devices = new Map();

        //Start device status checker
        var self = this;
        setInterval(function validateDevices() { 

            //Loop through all devices and check status
            self.devices.forEach(function(device, key) {
                var isAlive = device.checkStatus();
                if(!isAlive) {
                    Debug.Log("Connection timed out, removing device", "yellow");
                    self.removeDevice(key);
                }
            }, self);

        }, 3000);
    }

    // -- Add device
    addDevice(a_options) {

        //Create new device
        var newDevice = new Device(a_options);
        
        //Check for existing user
        if(this.devices.has(newDevice.uid)) {
            var loadedDevice = this.devices.get(newDevice.uid);
            loadedDevice.socket = a_options.socket;
            
            Debug.Log("[Device Manager] Device already existed. LOADING! UID: " + newDevice.uid, "blue");
            
            return loadedDevice;
        }

        //Check for local connections
        if(newDevice.clientIP == "::1") {
            //Client is local, create fake uid
            newDevice.uid = "local:" + this.devices.size;
        }

        //Push new device into device array
        this.devices.set(newDevice.uid, newDevice);

        Debug.Log("[Device Manager] Device added. UID: " + newDevice.uid, "blue");

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
                Debug.Log("Removing device by key. UID: " + a_device, "blue");
                return this.devices.delete(a_device);
            }
        }

        //Otherwise loop all and check
        this.devices.forEach(function(device, key) {
            //a_device is uid
            if(typeof a_device === 'number') {
                if(device.uid === a_device) {
                    Debug.Log("Removing device by UID. UID: " + device.uid, "blue");
                    return this.devices.delete(key);  
                }
            } else if (typeof a_device === 'object') {
                if(device === a_device) {
                    Debug.Log("Removing device by reference. UID: " + device.uid, "blue");
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

    broadcastState(a_state) {
        this.devices.forEach(function(device) {
            //Send state to device
            device.sendState(a_state);
        }, this);
    }

    getAllDevicesOfType(a_type) {
        var out = new Array();
        
        this.devices.forEach(function(d) {
            if(d.type === a_type)
                out.push(d);
        }, this);

        return out;
    }

    getAllDevicesOfRole(a_role) {
        var out = new Array();
        
        this.devices.forEach(function(d) {
            if(d.role === a_role)
                out.push(d);
        }, this);

        return out;
    }

    
}

module.exports = DeviceManager;