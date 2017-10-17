exports.enter = function () {
    // Shuffle clients and pick two challengers
    var clients = GH.System.deviceManager.getAllDevicesOfType("client");
    var shuffledClients = Utils.Shuffle(clients);

    shuffledClients[0].role = "challenger";
    shuffledClients[1].role = "challenger";

    this.model.challenger1 = shuffledClients[0].name;
    this.model.challenger2 = shuffledClients[1].name;

    console.log(this.model);

    //Pick random question for stage
    var questions = GH.System.gm.resources.get('qdata').source;
    var question = questions[Utils.RandomInt(0, questions.length)].question;

    this.model.question = question;
}