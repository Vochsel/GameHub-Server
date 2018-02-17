exports.onEnter = function () {
    Utils.StartTimer(() => {
        Debug.Log("Selection State Timer finished", "white", "state");
        GH.GMManager.Progress();
    }, 30);
}

exports.onExit = function() {
    Utils.ClearTimer();
    Debug.Log("Selection State Timer Cancelled", "white", "state");
}

exports.isValidated = function () {
    //Get number of ready clients
    var readyClients = Utils.Length(this.model.clientsReady);
    //Get number of total clients
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

    //Return true if all players are ready
    return readyClients >= numOfClients;
}