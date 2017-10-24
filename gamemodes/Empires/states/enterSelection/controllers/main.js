exports.clientSubmit = function (a_device, a_data) {

    var clientName = a_data.clientName;
    var clientSelection = a_data.clientSelection;

    //Check if already selected
    var alreadySelected = false;

    for (var key in this.parentState.parentStage.parentGM.model.themeSelections) {
        if (this.parentState.parentStage.parentGM.model.themeSelections.hasOwnProperty(key)) {
            if (this.parentState.parentStage.parentGM.model.themeSelections[key].selection === clientSelection)
                alreadySelected = true;
        }
    }

    //If valid, enter and continue
    if (Utils.Valid(clientName) && Utils.Valid(clientSelection) && !alreadySelected) {
        a_device.name = a_data.clientName;
        this.parentState.parentStage.parentGM.model.themeSelections[a_device.uid] = { uid: a_device.uid, name: a_device.name, selection: a_data.clientSelection };

        a_device.role = "ready";
    }

    a_device.shouldRefreshView = true;
}
