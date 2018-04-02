exports.isValidated = function () {
    //Get number of ready clients
    var readyClients = Utils.Length(this.model.clientsReady);
    //Get number of total clients
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

    //Check for min num of clients... TODO: Fix this
    if (numOfClients < 2)
        return false;

    //console.log(this.model);
    //console.log(readyClients >= numOfClients);
    //Return true if all players are ready
    return readyClients >= numOfClients;
}

exports.onEnter = function() {
    console.log(this.parentStage.parentGM.model.questions[this.parentStage.parentGM.model.currentAnswer]);
    this.model.currentQuestion = this.parentStage.parentGM.model.questions[this.parentStage.parentGM.model.currentAnswer];
}