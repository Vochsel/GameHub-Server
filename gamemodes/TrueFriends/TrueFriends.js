class TrueFriendsGM extends GH.GameMode {
    constructor(a_name) {
        super(a_name);
    }

    setup() {
        super.setup();

        var self = this;
        
        // -- Set TestGM Specific Properties
        this.name = "True Friends";
        this.version = "0.0.1";

        // -- Resources
        var questionData = new GH.Resource({uid: "qdata", name: "questionData", url: this.path + "/resources/pack_01.json"});
        
        questionData.on("load", function(data) {
            //Debug.Log("QuestionData UID: " + questionData.uid);
            Debug.Log("Test Data Loaded. Entries: " + Object.keys(data).length);
        })

        this.addResource(questionData);

        // -- Stages
        var introStage = new GH.Stage("Intro Stage");
        var beginState = new GH.State({ 
                name: "Begin State",
                isValidated: function() {
                    var readyClients = Object.keys(this.model.clientsReady).length;
                    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;

                    console.log(readyClients + " : " + numOfClients);
                    
                    return readyClients >= numOfClients;
                },
                model: {
                    clientsReady: {}
                },
                controller: {
                    clientIsReady: function(a_device) {
                        beginState.model.clientsReady[a_device.uid] = "ready";
                        console.log(beginState.model.clientsReady);
                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        data: "<h1>True Friends</h1><h3>Make Memories, Lose Friends</h3>"
                    }),
                    new GH.View({
                        type: "client",
                        data: "Welcome to True Friends. The game where you make fun of your friends! Wooo<br><br><input data-action='clientIsReady()' data-value='ready' type='button' value='Ready To Play'/>"
                    })
                ]
            });
            introStage.states.push(beginState);

        this.stages.push(introStage);

        var gameStage = new GH.Stage("Game Stage");
        gameStage.model.clientAnswers = {};
        gameStage.model.clientSelections = {};

        //Stage Callbacks
        gameStage.on("enter", function() {
            var clients = GH.System.deviceManager.getAllDevicesOfType('client');
            gameStage.data.chosenName = clients[Math.floor(Math.random() * clients.length)].name;

            var questions = self.resources.get('qdata').source;
            var question = questions[Math.floor(Math.random() * questions.length)].question;
            gameStage.data.question = question;
        });
            
            //State - Input
            var gsAnswerInput = new GH.State({
                
                isValidated: function() {
                    var readyClients = Object.keys(gameStage.model.clientAnswers).length;
                    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
                    
                    return readyClients >= numOfClients;
                },
                /*model: {
                    clientAnswers: {}
                },*/
                controller: {
                    clientSubmitAnswer: function(a_device, a_data) {
                        console.log("client submitted answer!");
                        gameStage.model.clientAnswers[a_device.uid] = {answer: a_data.clientAnswer};
                        console.log(gameStage.model.clientAnswers);
                        a_device.role = "ready";
                        a_device.shouldRefreshView = true;
                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        data: "<h1>{stage.data.question}</h1><br><h3>Enter your answers on your devices</h3>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "default",
                        data: "<input data-id='clientAnswer' type='text'/> <br> <input type='button' data-action='clientSubmitAnswer()' value='Submit!'/>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "ready",
                        data: "<h3>Please wait for others to finish!</h3>"
                    })
                ]
            });
            gameStage.states.push(gsAnswerInput);

            //State - Selection
            var gsAnswerSelection = new GH.State({
                isValidated: function() {
                    var selections = Object.keys(gameStage.model.clientSelections).length;
                    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
                    
                    return selections >= numOfClients;
                },
                controller: {
                    clientSubmitSelection(a_device, a_data) {
                        gameStage.model.clientSelections[a_device.uid] = {selection: a_data.answerSelection};
                        console.log(gameStage.model.clientSelections);
                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        data: "<h1>{stage.data.question}</h1><br><h3>Select the best answer!</h3>"
                    }),
                    new GH.View({
                        type: "client",
                        data: "{stage.model.clientAnswers}[<input type='button' data-action='clientSubmitSelection()' data-id='answerSelection' data-value='{answer}' value='{answer}'/>]"
                    })
                ]
            });
            gameStage.states.push(gsAnswerSelection);

            //State - Results
            var gsResults = new GH.State({
                views: [
                    new GH.View({
                        type: "hub",
                        data: "<h1>Results</h1>"
                    }),
                    new GH.View({
                        type: "client",
                        data: "RESULTS"
                    })
                ]
            });
            gameStage.states.push(gsResults);

        this.stages.push(gameStage);
            
    }
}