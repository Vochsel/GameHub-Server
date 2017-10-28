exports.isValidated = function() {
    var readyClients = Utils.Length(this.parentStage.model.clientAnswers);
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
    Debug.Log(readyClients);
    return readyClients >= numOfClients;
}