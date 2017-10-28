exports.clientIsReady = function(a_device, a_data) {
    var clientName = a_data.clientName;
    a_device.name = clientName;

    this.parentState.model.clientsReady[a_device.uid] = "ready";

    a_device.role = "ready";
    a_device.shouldRefreshView = true;
    a_device.shouldResetRole = true;
};

exports.clientIsNotReady = function(a_device, a_data) {
    delete this.parentState.model.clientsReady[a_device.uid];

    a_device.role = "default";
    a_device.shouldRefreshView = true;
};