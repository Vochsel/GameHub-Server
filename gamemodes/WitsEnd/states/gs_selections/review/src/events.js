exports.onEnter = function() {
    console.log("Current Answer" + this.parentStage.parentGM.model.currentAnswer);
    console.log(this.parentStage.parentGM.model.questions[this.parentStage.parentGM.model.currentAnswer]);
    this.model.currentQuestion = this.parentStage.parentGM.model.questions[this.parentStage.parentGM.model.currentAnswer];

    this.model.currentQuestion.challengers = Array.from(this.model.currentQuestion.challengers);
    this.model.currentQuestion.challengers.sort(function (a, b) {
        return b.votes.length - a.votes.length;
    });

    Utils.StartTimer(() => {
        GH.GMManager.Progress();
    }, 10);
}