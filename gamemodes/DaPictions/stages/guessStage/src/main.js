exports.onEnter = function() {
    //this.model.currentDrawing = Object.values(this.parentStage.parentGM.model.submissions)[this.parentStage.parentGM.model.currentGuess].drawing;

    var currentData = this.parentGM.model.submissions[Object.keys(this.parentGM.model.submissions)[this.parentGM.model.currentGuess]];
    this.model.currentData = currentData;
    
    Debug.Warning(currentData.answer);
    var clients = GH.System.deviceManager.getAllDevicesOfType("client");

    var curTheme = this.parentGM.model.themeName;
    var curDevice = clients[this.parentGM.model.currentGuess];
    var curSubTheme = curDevice.data.subTheme;
    Debug.Warning(curDevice.name);
    Debug.Warning(curSubTheme);
}

exports.onExit = function() {
    //console.log("Hey");
    this.parentGM.model.currentGuess += 1;
}