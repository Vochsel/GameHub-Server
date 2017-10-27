exports.onEnter = function() {
    
}

exports.onExit = function() {
    console.log("Hey");
    this.parentGM.model.currentGuess += 1;
}