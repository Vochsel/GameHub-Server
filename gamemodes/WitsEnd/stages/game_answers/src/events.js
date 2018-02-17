exports.onEnter = function() {

    var clients = GH.System.deviceManager.getAllDevicesOfType("client");
    var numClients = clients.length;
    var shuffledClients = Utils.Shuffle(clients);

    // Generate same num of questions as players
    this.parentGM.model.questions = new Array( numClients);

    var questions = this.parentGM.resources.get('qData').data;
    
    for(var i = 0; i <  numClients; i++) {
        this.parentGM.model.questions[i] = {};
        this.parentGM.model.questions[i].question = questions[Utils.RandomInt(0, questions.length)].question;
        this.parentGM.model.questions[i].challengerA = shuffledClients[(i * 2) %  numClients]
        this.parentGM.model.questions[i].challengerB = shuffledClients[((i * 2) + 1) %  numClients]
    }
    
    console.log("Hey");
    console.log(this.parentGM.model.questions);
    //Debug.Log(this.parentGM.model.questions, "white", "events")


    //Can only have an even number of questions 
    //Case 5 players = 5 questions = 2 questions each
    // q1 = p1 - p2
    // q2 = p3 - p4
    // q3 = p5 - p1
    // q4 = p2 - p3
    // q5 = p4 - p5


};