exports.clientFinished = function (a_device) {
    this.parentState.model.clientsFinished[a_device.uid] = true;

    a_device.setRole("finished", true);
}