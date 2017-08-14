class TrueFriendsGM extends GH.GameMode {
    constructor(a_name) {
        super(a_name);
    }

    setup() {
        super.setup();
        
        // -- Set TestGM Specific Properties
        this.name = "True Friends";
        this.version = "0.0.1";

        var introStage = new GH.Stage("Intro Stage");
        var beginState = new GH.State({ 
                name: "Begin State",
                isValidated: function() {
                    var readyClients = Object.keys(this.model.clientsReady).length;
                    var numOfClients = GH.deviceManager.getAllDevicesOfType("client").length;

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
                        data: "Welcome to True Friends. The game where you make fun of your friends! Wooo"
                    })
                ]
            });
            introStage.states.push(beginState);

        this.stages.push(introStage);
    }
}