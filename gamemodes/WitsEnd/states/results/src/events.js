{
    enter: function() {        
        Debug.Log("Results ENTERED");

        //console.log(thisStage.model.clientSelections);
        for(var idx in thisStage.model.clientSelections) {
            var val = thisStage.model.clientSelections[idx];
            //console.log(val);

            if(!Utils.Valid(GH.System.gm.model.clientScore[val.uid]))
                GH.System.gm.model.clientScore[val.uid] = new Object();
            
            GH.System.gm.model.clientScore[val.uid].name = val.name;     

            if(!Utils.Valid(GH.System.gm.model.clientScore[val.uid].totalVotes))
                GH.System.gm.model.clientScore[val.uid].totalVotes = 0;
            
            GH.System.gm.model.clientScore[val.uid].totalVotes += val.votes;
        }

    },
    isValidated: function() {
        //Get number of ready clients
        var readyClients = Utils.Length(this.model.clientsReady);
        //Get number of total clients
        var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
        
        //Return true if all players are ready
        return readyClients >= numOfClients;
    }
}