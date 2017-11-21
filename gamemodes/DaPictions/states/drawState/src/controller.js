exports.clientSubmit = function(device, data) {
    //console.log(data.canvas);
    this.parentState.parentStage.parentGM.model.submissions[device.uid] = {answer: device.data.subTheme, drawing: data.canvas, guesses: {}};
    
    device.role = "ready";
    device.shouldRefreshView = true;
    device.shouldResetRole = true;
    //device.shouldResetView = true;
}