exports.isValidated = function() {
    var readyClients = Object.keys(this.model.clientsReady).length;
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

    console.log(readyClients + " : " + numOfClients);
    
    return readyClients >= numOfClients;
};