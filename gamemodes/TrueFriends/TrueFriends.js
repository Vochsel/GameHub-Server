class TrueFriendsGM extends GH.GameMode {
    constructor() {
        // -- Set TestGM Specific Properties
        super({
            name: "True Friends",
            version: "0.0.3"
        });
    }

    setup() {
        super.setup();

        var self = this;
        
        // -- Resources
        var questionData = new GH.Resource({uid: "qdata", name: "questionData", url: this.path + "/resources/pack_01.json"});
        
        questionData.on("load", function(data) {
            Debug.Log("Question Data Loaded. Entries: " + Object.keys(data).length);
        })

        this.addResource(questionData);

        // -- Stages
        var introStage = new GH.Stage({
            name: "Intro Stage"
        });
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
                        data: "<h1 class='bold'>True Friends</h1><h3>Make Memories, Lose Friends</h3>"
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
            name: "Game Stage",
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
                device.role = "default";
            }, this);
        });
        /*gsAnswerInput.on("enter", function() {
            //Reset device roles 
            GH.System.deviceManager.getAllDevicesOfType("client").forEach(function(device) {
                device.role = "default";
            }, this);
        })*/
            
            //State - Input
            var gsAnswerInput = new GH.State({
                name: "Answer State",
                isValidated: function() {
                    var readyClients = Utils.Length(gameStage.model.clientAnswers);
                    var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
                    Debug.Log(readyClients);
                    return readyClients >= numOfClients;
                },
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
                        data: "<h1>{stage.model.question}</h1><h3>Enter your answers on your devices</h3>"
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
                name: "Answer Selection State",
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
                        //gameStage.model.clientSelections[a_device.uid] = {selection: a_data.answerSelection};
                        var sel = gameStage.model.clientSelections[a_data.answerSelection];
                        //if(!Array.isArray(sel))
                        //    sel = new Array();
                        if(!(gameStage.model.clientSelections[a_data.answerSelection]))
                            gameStage.model.clientSelections[a_data.answerSelection] = {answer: "", selections:0};

                        gsAnswerSelection.model.selections[a_device.name] = "ready";                        
                        gameStage.model.clientSelections[a_data.answerSelection].answer = a_data.answerSelection;
                        gameStage.model.clientSelections[a_data.answerSelection].selections += 1;
                        console.log(gameStage.model.clientSelections);
                        a_device.role = "ready";
                        a_device.shouldRefreshView = true;
                    }
                },
                views: [
                    new GH.View({
                        type: "hub",
                        data: "<h1>{stage.model.question}</h1><h3>Select the best answer!</h3>"
                    }),
                    new GH.View({
                        type: "client",
                        role: "default",
                        data: "{stage.model.clientAnswers}[<div class='button' data-action='clientSubmitSelection()' data-id='answerSelection' data-value='{answer}'>{answer}</div>]"
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
                    device.role = "default";
                }, this);
            })
            gsAnswerSelection.on("enter", function() {
                GH.System.deviceManager.getAllDevicesOfType("client").forEach(function(device) {
                    device.role = "default";
                }, this);
            })
            gameStage.states.push(gsAnswerSelection);

            //State - Results
            var gsResults = new GH.State({
                name: "Results State",
                views: [
                    new GH.View({
                        type: "hub",
                        data: "<h1>Results</h1>"
                    }),
                    new GH.View({
                        type: "client",
                        data: "{stage.model.clientSelections}[<h2>{answer} : {selections}</h4>]"
                    })
                ]
            });
            gameStage.states.push(gsResults);

        this.stages.push(gameStage);
            
    }
}