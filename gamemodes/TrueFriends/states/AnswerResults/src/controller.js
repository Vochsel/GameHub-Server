exports.clientReady = function (a_device) {
    this.parentState.model.clientsReady[a_device.uid] = "ready";

    a_device.role = "ready";
    a_device.shouldRefreshView = true;
    a_device.shouldResetRole = true;
}