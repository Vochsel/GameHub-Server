exports.isValidated = function() {
    var selections = Utils.Length(this.model.selections);
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
    Debug.Error(selections + " : " + numOfClients);
    return selections >= numOfClients;
}