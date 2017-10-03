{
    clientSubmit: function(a_device, a_data) {
        Debug.Log("Voted: " + a_data.selection + ", Answer: " + thisStage.model.clientSubmissions[a_data.selection].answer);
        
        if(!Utils.Valid(thisStage.model.clientSelections[a_data.selection]))
            thisStage.model.clientSelections[a_data.selection] = new Object();

        thisStage.model.clientSelections[a_data.selection].uid = thisStage.model.clientSubmissions[a_data.selection].uid;
        thisStage.model.clientSelections[a_data.selection].answer = thisStage.model.clientSubmissions[a_data.selection].answer;
        thisStage.model.clientSelections[a_data.selection].name = thisStage.model.clientSubmissions[a_data.selection].name;

        if(typeof thisStage.model.clientSelections[a_data.selection].votes !== "number")
            thisStage.model.clientSelections[a_data.selection].votes = 0;

        thisStage.model.clientSelections[a_data.selection].votes += 1;
        thisState.model.clientsReady[a_device.uid] = "ready";

        a_device.role = "ready";
        a_device.shouldRefreshView = true;
        a_device.shouldResetRole = true;
        
    }
}