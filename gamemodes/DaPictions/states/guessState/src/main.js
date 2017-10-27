exports.onEnter = function() {
    //console.log(this.parentStage.parentGM.model.submissions);
    this.model.currentDrawing = Object.values(this.parentStage.parentGM.model.submissions)[this.parentStage.parentGM.model.currentGuess].drawing;
    //this.model.currentDrawing = 10;
}

exports.isValidated = function() {
    var submissions = Utils.Length(this.parentStage.parentGM.model.submissions);
    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
    
    var guesses = Utils.Length(Object.values(this.parentStage.parentGM.model.submissions)[this.parentStage.parentGM.model.currentGuess].guesses);

    return guesses >= numOfClients;
}