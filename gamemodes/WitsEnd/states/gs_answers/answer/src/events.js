exports.isValidated = function () {
    //Get number of ready clients
    var readyClients = Utils.Length(this.model.clientsReady);
    //Get number of total clients
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

    var activeClients = GH.System.deviceManager.getAllDevicesOfRole("answering");
    var numOfActiveClients = GH.System.deviceManager.getAllDevicesOfRole("answering").length;


    console.log("Num active clients: " + numOfActiveClients);

    for(var client of activeClients) {
        console.log("sub: " + client.data.submitted);
        if(client.data.submitted == undefined || client.data.submitted == null)
            return false;
        if(client.data.submitted < 2)
            return false;
    }
    
    //Return true if all players are ready
    return true;
}

exports.onEnter = function() {
    Utils.StartTimer(() => {
        GH.GMManager.Progress();
    }, 20);
}

exports.onExit = function() {
    Utils.ClearTimer();
    
    var questions = this.parentStage.parentGM.model.questions;
    
    this.parentStage.parentGM.flow[2].repeats = Utils.Length(questions);
}
