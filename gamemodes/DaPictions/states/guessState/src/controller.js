exports.clientSubmit = function(device, data) {

    var clientGuess = data.clientSubmission;

    var correctGuess = 

    //this.parentState.parentStage.parentGM.model.guesses[device.uid] = data.clientSubmission;
    //Object.values(this.parentState.parentStage.parentGM.model.submissions)[this.parentState.parentStage.parentGM.model.currentGuess].guesses[device.uid] = data.clientSubmission;
    //console.log(this.parentState.parentStage.parentGM.model.submissions.guesses);

    device.role = "ready";
    device.shouldRefreshView = true;
    device.shouldResetRole = true;
}
