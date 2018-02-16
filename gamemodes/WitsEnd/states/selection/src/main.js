exports.onEnter = function () {
    Debug.Log("Selection State Entered", "white", "state");

    if(!Utils.Valid(exports.model))
        exports.model = {};

    exports.model.stateTimer = Utils.StartTimer(() => {
        Debug.Log("Selection State Timer finished", "white", "state");
        GH.GMManager.Progress();
    }, 30);
}

exports.onExit = function() {
    Debug.Log("Selection State Exiting", "white", "state");
    if(Utils.Valid(exports.model)) {        
        Utils.ClearTimer(exports.model.stateTimer);
        Debug.Log("Selection State Timer Cancelled", "white", "state");
    }
}

exports.isValidated = function () {
    //Get number of ready clients
    var readyClients = Utils.Length(this.model.clientsReady);
    //Get number of total clients
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

    //Return true if all players are ready
    return readyClients >= numOfClients;
}