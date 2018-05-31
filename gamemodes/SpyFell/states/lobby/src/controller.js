exports.clientIsReady = function (a_device, a_data) {
    //console.log(this);
    if (Utils.Valid(a_data.clientName)) {
        this.parentState.model.clientsReady[a_device.uid] = "ready";
        a_device.name = a_data.clientName;
        a_device.role = "ready";
        a_device.shouldRefreshView = true;
        a_device.shouldResetRole = true;
    }

    this.parentState.parentStage.parentGM.model.players[a_device.uid] = {name: a_device.name};

    console.log(this.parentState.parentStage.parentGM.model.players);
}
exports.clientIsNotReady = function (a_device) {
    delete this.parentState.model.clientsReady[a_device.uid];

    a_device.role = "default";
    a_device.shouldRefreshView = true;
}