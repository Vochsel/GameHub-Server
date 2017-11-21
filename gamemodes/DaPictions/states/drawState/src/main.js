exports.isValidated = function() {
    var submissions = Utils.Length(this.parentStage.parentGM.model.submissions);
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
    
    return submissions >= numOfClients;
    //return Utils.Valid(this.parentStage.model.drawing);
}

exports.onEnter = function() {
    this.parentStage.parentGM.model.submissions = new Object();
}

exports.onExit = function() {
    var submissions = Utils.Length(this.parentStage.parentGM.model.submissions);
    
    this.parentStage.parentGM.flow[1].repeats = Utils.Length(submissions);
}