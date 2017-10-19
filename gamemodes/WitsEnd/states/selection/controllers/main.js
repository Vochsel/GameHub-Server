exports.clientSubmit = function (a_device, a_data) {
    Debug.Log("Voted: " + a_data.selection + ", Answer: " + this.parentState.parentStage.model.clientSubmissions[a_data.selection].answer);

    if (!Utils.Valid(this.parentState.parentStage.model.clientSelections[a_data.selection]))
        this.parentState.parentStage.model.clientSelections[a_data.selection] = new Object();

    this.parentState.parentStage.model.clientSelections[a_data.selection].uid = this.parentState.parentStage.model.clientSubmissions[a_data.selection].uid;
    this.parentState.parentStage.model.clientSelections[a_data.selection].answer = this.parentState.parentStage.model.clientSubmissions[a_data.selection].answer;
    this.parentState.parentStage.model.clientSelections[a_data.selection].name = this.parentState.parentStage.model.clientSubmissions[a_data.selection].name;

    if (typeof this.parentState.parentStage.model.clientSelections[a_data.selection].votes !== "number")
        this.parentState.parentStage.model.clientSelections[a_data.selection].votes = 0;

    this.parentState.parentStage.model.clientSelections[a_data.selection].votes += 1;
    this.parentState.model.clientsReady[a_device.uid] = "ready";

    a_device.role = "ready";
    a_device.shouldRefreshView = true;
    a_device.shouldResetRole = true;

}