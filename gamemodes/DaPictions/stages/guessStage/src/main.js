exports.onEnter = function() {
    this.model.currentDrawing = Object.values(this.parentStage.parentGM.model.submissions)[this.parentStage.parentGM.model.currentGuess].drawing;
}

exports.onExit = function() {
    //console.log("Hey");
    this.parentGM.model.currentGuess += 1;
}