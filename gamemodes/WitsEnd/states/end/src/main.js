{
    enter: function() {
        console.log(GH.System.gm.model.clientScore);
    },
    isValidated: function() {
        //Get number of ready clients
        var finishedClients = Utils.Length(this.model.clientsFinished);
        //Get number of total clients
        var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
        
        //Return true if all players are ready
        return finishedClients >= numOfClients;
    },
}