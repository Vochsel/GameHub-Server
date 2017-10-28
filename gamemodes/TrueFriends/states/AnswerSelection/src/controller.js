exports.clientSubmitSelection = function(a_device, a_data) {
    var sel = this.parentState.parentStage.model.clientSelections[a_data.answerSelection];
    if(!(this.parentState.parentStage.model.clientSelections[a_data.answerSelection]))
        this.parentState.parentStage.model.clientSelections[a_data.answerSelection] = {
            uid: a_device.uid,
            name: a_device.name,
            answer: "", 
            selections:0,
        };

    this.parentState.model.selections[a_device.name] = "ready";                        
    this.parentState.parentStage.model.clientSelections[a_data.answerSelection].name = this.parentState.parentStage.model.clientAnswers[a_data.answerSelection].name;
    this.parentState.parentStage.model.clientSelections[a_data.answerSelection].answer = this.parentState.parentStage.model.clientAnswers[a_data.answerSelection].answer;
    this.parentState.parentStage.model.clientSelections[a_data.answerSelection].selections += 1;
    console.log(this.parentState.parentStage.model.clientSelections);
    a_device.role = "ready";

    a_device.shouldRefreshView = true;
    a_device.shouldResetRole = true;
}