exports.isValidated = function () {
    
    //Get number of ready clients
    var readyClients = Utils.Length(this.parentStage.parentGM.model.themeSelections);
    //Get number of total clients
    //var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

    //Return true if all players are ready
    return readyClients >= 3;
}
