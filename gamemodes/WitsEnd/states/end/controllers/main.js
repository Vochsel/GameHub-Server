exports.clientFinished = function (a_device) {
    this.parentState.model.clientsFinished[a_device.uid] = "finished";

    a_device.role = "finished";
    a_device.shouldRefreshView = true;
    a_device.shouldResetRole = true;
}