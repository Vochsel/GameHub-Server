exports.isValidated = function () {
    //Get number of ready clients
    var readyClients = Utils.Length(this.model.clientsReady);
    //Get number of total clients
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
    var numOfActiveClients = GH.System.deviceManager.getAllDevicesOfRole("default").length;

    //Return true if all players are ready
    return readyClients >= numOfClients;
}