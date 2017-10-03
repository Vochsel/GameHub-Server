{
    isValidated: function() {
         //Get number of ready clients
         var readyClients = Utils.Length(GH.System.gm.model.themeSelections);
         //Get number of total clients
         var numOfClients = GH.System.deviceManager.getAllDevicesOfType("client").length;
         
         //Return true if all players are ready
         return readyClients >= numOfClients;
    }
}