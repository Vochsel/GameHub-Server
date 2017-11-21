exports.onEnter = function () {
    console.log(this.parentStage.parentGM.model.clientScore);

    this.parentStage.parentGM.model.clientScore = Array.from(this.parentStage.parentGM.model.clientScore);
    this.parentStage.parentGM.model.clientScore.sort(function (a, b) {
        return a.totalVotes - b.totalVotes;
    });
}
exports.isValidated = function () {
    //Get number of ready clients
    var finishedClients = Utils.Length(this.model.clientsFinished);
    //Get number of total clients
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

    //Return true if all players are ready
    return finishedClients >= numOfClients;
}