exports.clientIsReady = function(a_device, a_data) {
    var clientName = a_data.clientName;

    var allClients = GH.System.deviceManager.getAllDevicesOfType("client");
    for(var i = 0; i < Utils.Length(allClients); i++) {
        if(allClients[i].uid !== a_device.uid) {
            if(allClients[i].name === clientName) {
                Debug.Log("Returning, name exists already!");
                return;
            }
        }
    }

    a_device.name = clientName;

    this.parentState.model.clientsReady[a_device.uid] = "ready";

    a_device.setRole("ready", true);
};

exports.clientIsNotReady = function(a_device, a_data) {
    delete this.parentState.model.clientsReady[a_device.uid];

    a_device.setRole("default", true);
};