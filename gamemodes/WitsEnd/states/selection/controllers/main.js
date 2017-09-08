{
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
}