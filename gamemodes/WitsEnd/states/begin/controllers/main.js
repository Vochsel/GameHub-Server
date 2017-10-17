exports.clientIsReady = function (a_device, a_data) {
    //console.log(state);
    if (Utils.Valid(a_data.clientName)) {
        thisState.model.clientsReady[a_device.uid] = "ready";
        a_device.name = a_data.clientName;
        a_device.role = "ready";
        a_device.shouldRefreshView = true;
        a_device.shouldResetRole = true;
    }
}
exports.clientIsNotReady = function (a_device) {
    delete thisState.model.clientsReady[a_device.uid];

    a_device.role = "default";
    a_device.shouldRefreshView = true;
}