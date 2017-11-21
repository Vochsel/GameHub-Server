exports.clientSubmitAnswer = function(a_device, a_data) {
    
    if(a_data.clientAnswer === "")
        return;
    Debug.Log("client submitted answer!");
    

    //Check for existing answer
    for(var i = 0; i < Utils.Length(this.parentState.parentStage.model.clientAnswers); i++) {
        var ans = this.parentState.parentStage.model.clientAnswers[i];
    }

    for (var key in this.parentState.parentStage.model.clientAnswers) {
        if (this.parentState.parentStage.model.clientAnswers.hasOwnProperty(key)) {
            if(this.parentState.parentStage.model.clientAnswers[key].answer === a_data.clientAnswer) {
                Debug.Log("Duplicate answer");
                return;
            }
        }
    }

    this.parentState.parentStage.model.clientAnswers[a_device.uid] = {user: a_device.uid, name: a_device.name, answer: a_data.clientAnswer};
    //console.log(this.parentState.parentStage.model.clientAnswers);
    
    a_device.setRole("ready", true);
}