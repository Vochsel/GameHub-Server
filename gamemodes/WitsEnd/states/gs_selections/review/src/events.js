exports.onEnter = function() {
    console.log("Current Answer" + this.parentStage.parentGM.model.currentAnswer);
    console.log(this.parentStage.parentGM.model.questions[this.parentStage.parentGM.model.currentAnswer]);
    this.model.currentQuestion = this.parentStage.parentGM.model.questions[this.parentStage.parentGM.model.currentAnswer];

    Utils.StartTimer(() => {
        GH.GMManager.Progress();
    }, 10);
}