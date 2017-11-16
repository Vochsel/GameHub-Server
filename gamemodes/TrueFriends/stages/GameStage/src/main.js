exports.onEnter = function() {
    var clients = GH.System.deviceManager.getAllDevicesOfType('client');

    //Choose random player
    var chosenIdx = Math.floor(Math.random() * clients.length);

    //Prevent same player twice in row
    if(this.parentGM.model.lastPlayerChosen === chosenIdx) {
        chosenIdx = (chosenIdx + 1) % clients.length;
    }

    //Set chosen player
    this.model.chosenName = clients[chosenIdx].name;
    this.parentGM.model.lastPlayerChosen = chosenIdx;

    //Load all questions
    console.log(this.parentGM.resources.get('qdata'));
    var questions = this.parentGM.resources.get('qdata').data;

    //Choose random question
    var chosenQuestionIdx = Utils.RandomInt(0, questions.length);

    //Prevent same question twice in row
    if(this.parentGM.model.lastQuestionChosen === chosenQuestionIdx) {
        chosenQuestionIdx = (chosenQuestionIdx + 1) % questions.length;
    }

    //Set chosen question
    var question = questions[chosenQuestionIdx].question;
    this.parentGM.model.lastQuestionChosen = chosenQuestionIdx;

    this.model.question = question;

    //Reset device roles 
    GH.System.deviceManager.getAllDevicesOfType("client").forEach(function(device) {
        device.reset();
    }, this);
}