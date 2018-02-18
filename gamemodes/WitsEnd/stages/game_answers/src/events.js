exports.onEnter = function() {

    var clients = GH.System.deviceManager.getAllDevicesOfType("client");
    var numClients = clients.length;
    var shuffledClients = Utils.Shuffle(clients);

    for(var client of shuffledClients) {
        client.data.questions = new Array();
    }

    // Generate same num of questions as players
    this.parentGM.model.questions = new Array( numClients);

    var questions = this.parentGM.resources.get('qData').data;
    
    for(var i = 0; i <  numClients; i++) {
        this.parentGM.model.questions[i] = {};
        this.parentGM.model.questions[i].question = questions[Utils.RandomInt(0, questions.length)].question;
        this.parentGM.model.questions[i].challengers = new Array();

        var d1 = shuffledClients[(i * 2) %  numClients];
        var d2 = shuffledClients[((i * 2) + 1) %  numClients];

        //Give devices a reference to their question id
        console.log("Index: " + i);
        d1.data.questions.push({qid: i, questionText: this.parentGM.model.questions[i].question});
        d2.data.questions.push({qid: i, questionText: this.parentGM.model.questions[i].question});


        this.parentGM.model.questions[i].challengers.push({"device": d1, "answer": "blank"});
        this.parentGM.model.questions[i].challengers.push({"device": d2, "answer": "blank"});

        console.log(this.parentGM.model.questions[i].question + " : " + this.parentGM.model.questions[i].challengers[0].device.uid + " vs " +this.parentGM.model.questions[i].challengers[1].device.uid);
    }
    
    console.log("Hey");
    //console.log(this.parentGM.model.questions);
    //Debug.Log(this.parentGM.model.questions, "white", "events")


    //Can only have an even number of questions 
    //Case 5 players = 5 questions = 2 questions each
    // q1 = p1 - p2
    // q2 = p3 - p4
    // q3 = p5 - p1
    // q4 = p2 - p3
    // q5 = p4 - p5

    /*

    [
        {
            "question",
            "answers": [
                {"user_id1": "a1"},
                {"user_id2": "a2"},
                {"user_id3": "a3"},
            ]
        }
    ]

    */


};