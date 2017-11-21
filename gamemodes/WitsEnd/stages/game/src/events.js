exports.onEnter = function () {
    // Shuffle clients and pick two challengers
    var clients = GH.System.deviceManager.getAllDevicesOfType("client");
    var shuffledClients = Utils.Shuffle(clients);

    shuffledClients[0].role = "challenger";
    shuffledClients[1].role = "challenger";

    this.model.challenger1 = shuffledClients[0].name;
    this.model.challenger2 = shuffledClients[1].name;
    //Prevent same two peeps
    if(this.model.challenger2 == this.parentGM.model.lastChallenger1 || this.model.challenger2 == this.parentGM.model.lastChallenger2) {
        this.model.challenger2 = shuffledClients[2 % Utils.Length(shuffledClients)].name;
        if(this.model.challenger2 == this.parentGM.model.lastChallenger1 || this.model.challenger2 == this.parentGM.model.lastChallenger2) {
            this.model.challenger2 = shuffledClients[3 % Utils.Length(shuffledClients)].name;
        }
    }

    this.parentGM.model.lastChallenger1 = this.model.challenger1;
    this.parentGM.model.lastChallenger2 = this.model.challenger2;

    //console.log(this.model);

    //Pick random question for stage

    var questions = this.parentGM.resources.get('qData').data;
    var question = questions[Utils.RandomInt(0, questions.length)].question;

    this.model.question = question;
}