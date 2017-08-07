class DeviceManager {
    constructor() {
        this.devices = new Array();
    }

    addDevice(a_id, a_remoteAddress, a_socket) {

        //Create new device
        var newDevice = new Device(a_id, a_remoteAddress, a_socket);

        //Push new device into device array
        this.devices.push(newDevice);

        //Return new device for external reference
        return newDevice;
    }

    removeDevice(a_id) {

    }
}

class Device {
    constructor(a_id, a_remoteAddress, a_socket) {
        this.uid = a_id;
        this.remoteAddress = a_remoteAddress;
        this.socket = a_socket;
    }
}