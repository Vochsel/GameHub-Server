exports.onEnter = function () {

    Utils.StartTimer(() => {
        Debug.Log("Result State Timer finished", "white", "state");
        GH.GMManager.Progress();
    }, 30);

    //console.log(thisStage.model.clientSelections);
    for (var idx in this.parentStage.model.clientSelections) {
        var val = this.parentStage.model.clientSelections[idx];
        //console.log(val);

        if (!Utils.Valid(this.parentStage.parentGM.model.clientScore[val.uid]))
            this.parentStage.parentGM.model.clientScore[val.uid] = new Object();

        this.parentStage.parentGM.model.clientScore[val.uid].name = val.name;

        if (!Utils.Valid(this.parentStage.parentGM.model.clientScore[val.uid].totalVotes))
            this.parentStage.parentGM.model.clientScore[val.uid].totalVotes = 0;

        this.parentStage.parentGM.model.clientScore[val.uid].totalVotes += val.votes;
    }
    /*this.parentStage.parentGM.model.clientScore = Array.from(this.parentStage.parentGM.model.clientScore);
    this.parentStage.parentGM.model.clientScore.sort(function (a, b) {
        return a.totalVotes - b.totalVotes;
    });*/

}

exports.onExit = function() {
    Utils.ClearTimer();
    Debug.Log("Result State Timer Cancelled", "white", "state");
}

exports.isValidated = function () {
    //Get number of ready clients
    var readyClients = Utils.Length(this.model.clientsReady);
    //Get number of total clients
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

    //Return true if all players are ready
    return readyClients >= numOfClients;
}