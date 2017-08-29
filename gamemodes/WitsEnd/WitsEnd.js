class WitsEndGM extends GH.GameMode {
    constructor() {
        // -- Set TestGM Specific Properties
        super({
            name: "Wits End",
            version: "0.0.1",
            flow: [
                {
                    stage : "IntroStage",
                    repeats: 1
                },
                {
                    stage : "GameStage",
                    repeats: 5
                },
                {
                    stage : "OutroStage",
                    repeats: 1
                }
            ],
            model: {
                clientScore: {}
            }
        });
    }

    setup() {
        super.setup();

        var gm = this;
        
        // -- Resources

        //Load question data
        var questionData = new GH.Resource({
            uid: "qdata", 
            name: "questionData", 
            url: this.path + "/resources/pack_01.json"
        });

        //Add resource to GameMode
        this.addResource(questionData);

        // ---------------------- Intro Stage ----------------------
        var introStage = new GH.Stage({
            name: "IntroStage",
        });
        this.stages.push(introStage);        

            var beginState = new GH.State({ 
                name: "Begin State",
                isValidated: function() {
                    //Get number of ready clients
                    var readyClients = Utils.Length(this.model.clientsReady);
                    //Get number of total clients
                    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

                    //Check for min num of clients... TODO: Fix this
                    if(numOfClients < 2)
                        return false;

                    console.log(this.model);
                    console.log(readyClients >= numOfClients);
                    //Return true if all players are ready
                    return readyClients >= numOfClients;
                },
                model: {
                    clientsReady: {}
                },
                controller: {
                    clientIsReady: function(a_device, a_data) {
                        
                        if(Utils.Valid(a_data.clientName)) {
                            beginState.model.clientsReady[a_device.uid] = "ready";
                            a_device.name = a_data.clientName;
                            a_device.role = "ready";
                            a_device.shouldRefreshView = true;
                            a_device.shouldResetRole = true;
                        }                        
                    },
                    clientIsNotReady: function(a_device) {
                        delete beginState.model.clientsReady[a_device.uid];

                        a_device.role = "default";
                        a_device.shouldRefreshView = true;
                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        //src: "views/beginState/hub.html"
                        data: "<h1 class='bold'>Wits End!</h1><h3>Go head to head to win the laughs of your friends!</h3>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "default",
                        data: "Welcome! Please enter your name below!<br><br><input type='text' data-id='clientName' placeholder='Your Name'/><div class='button' data-action='clientIsReady()' data-value='ready'>Ready To Play!</div>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "ready",
                        data: "Welcome! Please wait for everyone else to be ready!<br><br><div class='button' data-action='clientIsNotReady()' data-value='ready'>Unready!</div>"
                    })
                    
                ]
            });
            introStage.states.push(beginState);

        // ---------------------- Game Stage ----------------------
        var gameStage = new GH.Stage({
            name: "GameStage",
            model: {
                question: "",
                clientSubmissions: {},
                clientSelections: {}
            },
            enter: function() {

                // Shuffle clients and pick two challengers
                var clients = GH.System.deviceManager.getAllDevicesOfType("client");                
                var shuffledClients = Utils.Shuffle(clients);

                shuffledClients[0].role = "challenger";
                shuffledClients[1].role = "challenger";

                this.model.challenger1 = shuffledClients[0].name;
                this.model.challenger2 = shuffledClients[1].name;


                //Pick random question for stage
                var questions = gm.resources.get('qdata').source;
                var question = questions[Utils.RandomInt(0, questions.length)].question;
                
                gameStage.model.question = question;  
            }
        });
        this.stages.push(gameStage);

            //Answer State
            var answerState = new GH.State({ 
                name: "Answer State",
                isValidated: function() {
                    //Return true if all players are ready
                    return Utils.Length(gameStage.model.clientSubmissions) >= 2;
                },
                model: {
                    clientsReady: {}
                },
                controller: {
                    clientSubmit: function(a_device, a_data) {
                        if(Utils.Valid(a_data.clientSubmission)) {
                            gameStage.model.clientSubmissions[a_device.uid] = {uid: a_device.uid, name: a_device.name, answer: a_data.clientSubmission};

                            a_device.role = "default";
                            a_device.shouldRefreshView = true;    
                        }                        
                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        //src: "views/answerState/hub.html"
                        data: "<h1>{stage.model.question}</h1> <h3>{stage.model.challenger1} VS. {stage.model.challenger2}</h3>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "default",
                        data: "Please wait for the two challengers to input their best answer!"
                    }),
                    new GH.View({
                        type: "client",
                        role: "challenger",
                        data: "<h4>{stage.model.question}</h4><input type='text' data-id='clientSubmission'/><div class='button' data-action='clientSubmit()'>Submit!</div>"
                    })
                    
                ]
            });
            gameStage.states.push(answerState);

            //Selection State
            var selectionState = new GH.State({ 
                name: "Selection State",
                isValidated: function() {
                    //Get number of ready clients
                    var readyClients = Utils.Length(this.model.clientsReady);
                    //Get number of total clients
                    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
                    
                    //Return true if all players are ready
                    return readyClients >= numOfClients;
                },
                model: {
                    clientsReady: {}
                },
                controller: {
                    clientSubmit: function(a_device, a_data) {
                        Debug.Log("Voted: " + a_data.selection + ", Answer: " + gameStage.model.clientSubmissions[a_data.selection].answer);
                        
                        if(!Utils.Valid(gameStage.model.clientSelections[a_data.selection]))
                            gameStage.model.clientSelections[a_data.selection] = new Object();

                        gameStage.model.clientSelections[a_data.selection].uid = gameStage.model.clientSubmissions[a_data.selection].uid;
                        gameStage.model.clientSelections[a_data.selection].answer = gameStage.model.clientSubmissions[a_data.selection].answer;
                        gameStage.model.clientSelections[a_data.selection].name = gameStage.model.clientSubmissions[a_data.selection].name;

                        if(typeof gameStage.model.clientSelections[a_data.selection].votes !== "number")
                            gameStage.model.clientSelections[a_data.selection].votes = 0;

                        gameStage.model.clientSelections[a_data.selection].votes += 1;
                        selectionState.model.clientsReady[a_device.uid] = "ready";

                        a_device.role = "ready";
                        a_device.shouldRefreshView = true;
                        a_device.shouldResetRole = true;
                        
                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        //src: "views/selectionState/hub.html"
                        data: "<h3>{stage.model.question}</h3> <h4>{stage.model.challenger1} VS. {stage.model.challenger2}</h4>{stage.model.clientSubmissions}[<h2 class='bold'>{answer}  </h2>]"
                    }),
                    new GH.View({
                        type: "client",
                        role: "default",
                        data: "{stage.model.clientSubmissions}[<div class='button' data-action='clientSubmit()' data-id='selection' data-value='{uid}'>{answer}</div>]"
                    }),
                    new GH.View({
                        type: "client",
                        role: "ready",
                        data: "Please wait for the rest of the votes!"
                    })
                    
                ]
            });
            gameStage.states.push(selectionState);

            //Results State
            var resultsState = new GH.State({ 
                name: "Results State",
                enter: function() {        
                    Debug.Log("Results ENTERED");

                    //console.log(gameStage.model.clientSelections);
                    for(var idx in gameStage.model.clientSelections) {
                        var val = gameStage.model.clientSelections[idx];
                        //console.log(val);

                        if(!Utils.Valid(gm.model.clientScore[val.uid]))
                            gm.model.clientScore[val.uid] = new Object();
                        
                        gm.model.clientScore[val.uid].name = val.name;     

                        if(!Utils.Valid(gm.model.clientScore[val.uid].totalVotes))
                            gm.model.clientScore[val.uid].totalVotes = 0;
                        
                        gm.model.clientScore[val.uid].totalVotes += val.votes;
                    }

                },
                isValidated: function() {
                    //Get number of ready clients
                    var readyClients = Utils.Length(this.model.clientsReady);
                    //Get number of total clients
                    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
                    
                    //Return true if all players are ready
                    return readyClients >= numOfClients;
                },
                model: {
                    clientsReady: {}
                },
                controller: {
                    clientReady: function(a_device) {
                        resultsState.model.clientsReady[a_device.uid] = "ready";

                        a_device.role = "ready";
                        a_device.shouldRefreshView = true;
                        a_device.shouldResetRole = true;                        
                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        //src: "views/resultsState/hub.html"
                        data: "<h3>{stage.model.question}</h3> {stage.model.clientSelections}[<div class='billboard'>{name} : {answer}<div class='badge'>{votes}</div>  </div>]"
                    }),
                    new GH.View({
                        type: "client",
                        role: "default",
                        data: "<div class='button' data-action='clientReady()'>Ready!</div>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "ready",
                        data: "Please wait for the others!"
                    })
                    
                ]
            });
            gameStage.states.push(resultsState);

        // ---------------------- Outro Stage ----------------------
        var outroStage = new GH.Stage({
            name: "OutroStage"
        });
        this.stages.push(outroStage);

            //Outro state
            var endState = new GH.State({ 
                name: "End State",
                enter: function() {
                    console.log(gm.model.clientScore);
                },
                isValidated: function() {
                    //Get number of ready clients
                    var finishedClients = Utils.Length(this.model.clientsFinished);
                    //Get number of total clients
                    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
                    
                    //Return true if all players are ready
                    return finishedClients >= numOfClients;
                },
                model: {
                    clientsFinished: {}
                },
                controller: {
                    clientFinished: function(a_device) {
                        endState.model.clientsFinished[a_device.uid] = "finished";

                        a_device.role = "finished";
                        a_device.shouldRefreshView = true;
                        a_device.shouldResetRole = true;                        
                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        //src: "views/endState/hub.html"
                        data: "<h2>Thanks for playing Wits End!</h2>{gm.model.clientScore}[<h4>{name} - {totalVotes}</h4>]"
                    }),
                    new GH.View({
                        type: "client",
                        role: "default",
                        data: "<div class='button' data-action='clientFinished()'>Finished!</div>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "finished",
                        data: "Please wait for the others!"
                    })
                    
                ]
            });
            outroStage.states.push(endState);
        
    }
}