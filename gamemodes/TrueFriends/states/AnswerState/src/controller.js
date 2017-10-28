exports.clientSubmitAnswer = function(a_device, a_data) {
    console.log("client submitted answer!");
    this.parentState.parentStage.model.clientAnswers[a_device.uid] = {user: a_device.uid, answer: a_data.clientAnswer};
    console.log(this.parentState.parentStage.model.clientAnswers);
    a_device.role = "ready";
    a_device.shouldRefreshView = true;
    a_device.shouldResetRole = true;
}