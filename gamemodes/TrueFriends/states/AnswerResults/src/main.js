exports.isValidated = function () {
    //Get number of ready clients
    var readyClients = Utils.Length(this.model.clientsReady);
    //Get number of total clients
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

    //Return true if all players are ready
    return readyClients >= numOfClients;
}

exports.onEnter = function () {

    //console.log(thisStage.model.clientSelections);
    for (var idx in this.parentStage.model.clientSelections) {
        var val = this.parentStage.model.clientSelections[idx];
        //console.log(val);

        if (!Utils.Valid(this.parentStage.parentGM.model.clientScore[val.uid]))
            this.parentStage.parentGM.model.clientScore[val.uid] = new Object();

        this.parentStage.parentGM.model.clientScore[val.uid].name = val.name;

        if (!Utils.Valid(this.parentStage.parentGM.model.clientScore[val.uid].totalVotes))
            this.parentStage.parentGM.model.clientScore[val.uid].totalVotes = 0;

        this.parentStage.parentGM.model.clientScore[val.uid].totalVotes += val.selections;
    }

    //console.log(this.parentStage.parentGM.model);
    console.log(this.parentStage.model.clientSelections)
    this.parentStage.model.clientSelections = Object.keys(this.parentStage.model.clientSelections).map((k) => this.parentStage.model.clientSelections[k]);
    console.log(this.parentStage.model.clientSelections)
    this.parentStage.model.clientSelections.sort(function (a, b) {
        return b.selections - a.selections;
    });

}