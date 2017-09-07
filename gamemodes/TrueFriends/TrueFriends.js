class TrueFriendsGM extends GH.GameMode {
    constructor() {
        // -- Set TestGM Specific Properties
        super({
            name: "True Friends",
            version: "0.0.3",
            flow: [
                {
                    stage : "IntroStage",
                    repeats: 1
                },
                {
                    stage : "GameStage",
                    repeats: 5
                }
            ],
        });
    }

    setup() {
        super.setup();

        var self = this;
        
        // -- Resources

        //Load question data
        var questionData = new GH.Resource({
            uid: "qdata", 
            name: "questionData", 
            url: this.path + "/resources/pack_01.json"
        });

        //Add resource to GameMode
        this.addResource(questionData);

        // -- Stages
        var introStage = new GH.Stage({
            name: "IntroStage"
        });
            var beginState = new GH.State({ 
                name: "BeginState",
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

                        a_device.role = "ready";
                        a_device.shouldRefreshView = true;
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
                        data: "<h1 class='bold'>True Friends. Ben is the best!</h1><h3>Make Memories, Lose Friends</h3>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "default",
                        data: "Welcome to True Friends. The game where you make fun of your friends!<br><br><div class='button' data-action='clientIsReady()' data-value='ready'>Ready To Play!</div>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "ready",
                        data: "Welcome to True Friends. The game where you make fun of your friends!<br><br><div class='button' data-action='clientIsNotReady()' data-value='ready'>Unready!</div>"
                    })
                    
                ]
            });
            introStage.states.push(beginState);

        this.stages.push(introStage);

        var gameStage = new GH.Stage({
            name: "GameStage",
            model: {
                clientAnswers: {},
                clientSelections: {}
            }
        });

        //Stage Callbacks
        gameStage.on("enter", function() {
            var clients = GH.System.deviceManager.getAllDevicesOfType('client');
            gameStage.model.chosenName = clients[Math.floor(Math.random() * clients.length)].name;

            var questions = self.resources.get('qdata').source;
            var question = questions[Math.floor(Math.random() * questions.length)].question;
            gameStage.model.question = question;

            //Reset device roles 
            GH.System.deviceManager.getAllDevicesOfType("client").forEach(function(device) {
                device.reset();
            }, this);
        });
            //State - Input
            var gsAnswerInput = new GH.State({
                name: "AnswerState",
                isValidated: function() {
                    var readyClients = Utils.Length(gameStage.model.clientAnswers);
                    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
                    Debug.Log(readyClients);
                    return readyClients >= numOfClients;
                },
                controller: {
                    clientSubmitAnswer: function(a_device, a_data) {
                        console.log("client submitted answer!");
                        gameStage.model.clientAnswers[a_device.uid] = {user: a_device.uid, answer: a_data.clientAnswer};
                        console.log(gameStage.model.clientAnswers);
                        a_device.role = "ready";
                        a_device.shouldRefreshView = true;
                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        data: "<h1 class='bold'>{stage.model.question}</h1><h3>Enter your answers on your devices</h3>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "default",
                        data: "<input data-id='clientAnswer' type='text'/> <br> <div class='button' data-action='clientSubmitAnswer()' data-value='ready'>Submit</div>"
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
                name: "AnswerSelectionState",
                isValidated: function() {
                    var selections = Utils.Length(gsAnswerSelection.model.selections);
                    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
                    Debug.Log(selections);
                    return selections >= numOfClients;
                },
                model: {
                    selections: {}
                },
                controller: {
                    clientSubmitSelection(a_device, a_data) {
                        var sel = gameStage.model.clientSelections[a_data.answerSelection];
                        if(!(gameStage.model.clientSelections[a_data.answerSelection]))
                            gameStage.model.clientSelections[a_data.answerSelection] = {answer: "", selections:0};

                        gsAnswerSelection.model.selections[a_device.name] = "ready";                        
                        gameStage.model.clientSelections[a_data.answerSelection].answer = gameStage.model.clientAnswers[a_data.answerSelection].answer;
                        gameStage.model.clientSelections[a_data.answerSelection].selections += 1;
                        console.log(gameStage.model.clientSelections);
                        a_device.role = "ready";

                        a_device.shouldRefreshView = true;

                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        data: "<h1>{stage.model.question}</h1><h3>Select the best answer!</h3><br>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "default",
                        data: "{stage.model.clientAnswers}[<div class='button' data-action='clientSubmitSelection()' data-id='answerSelection' data-value='{user}'>{answer}</div>]"
                    }),
                    new GH.View({
                        type: "client",
                        role: "ready",
                        data: "<h3>Please wait for others to finish!</h3>"
                    })
                ]
            });
            gsAnswerSelection.on("exit", function() {
                GH.System.deviceManager.getAllDevicesOfType("client").forEach(function(device) {
                    device.reset();
                }, this);
            })
            gsAnswerSelection.on("enter", function() {
                GH.System.deviceManager.getAllDevicesOfType("client").forEach(function(device) {
                    device.reset();
                }, this);
            })
            gameStage.states.push(gsAnswerSelection);

            //State - Results
            var gsResults = new GH.State({
                name: "ResultsState",
                views: [
                    new GH.View({
                        type: "hub",
                        data: "<h1>Results</h1><div class='billboard_container'>{stage.model.clientSelections}[<div class='billboard'>{answer}<div class='badge'>{selections}</div>  </div>]</div>"
                    }),
                    new GH.View({
                        type: "client",
                        data: "{stage.model.clientSelections}[<div class='button'>{answer}<div class='badge'>{selections}</div>  </div>]"
                    })
                ]
            });
            gameStage.states.push(gsResults);

        this.stages.push(gameStage);
            
    }
}