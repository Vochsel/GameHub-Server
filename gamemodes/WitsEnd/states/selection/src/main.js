exports.onEnter = function () {
    console.log("ent");    
    Utils.StartTimer(() => {
        console.log("prog");
        GH.GMManager.Progress();
    }, 30);
}


exports.isValidated = function () {
    //Get number of ready clients
    var readyClients = Utils.Length(this.model.clientsReady);
    //Get number of total clients
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

    //Return true if all players are ready
    return readyClients >= numOfClients;
}