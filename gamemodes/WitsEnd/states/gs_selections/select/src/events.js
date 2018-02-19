exports.onEnter = function() {
    console.log(this.parentStage.parentGM.model.questions[this.parentStage.parentGM.model.currentAnswer]);
    this.model.currentQuestion = this.parentStage.parentGM.model.questions[this.parentStage.parentGM.model.currentAnswer];
}