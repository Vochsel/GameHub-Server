exports.clientReady = function (a_device) {
    this.parentState.model.clientsReady[a_device.uid] = "ready";

    a_device.setRole("ready", true);
}