exports.isValidated = function () {
    //Return true if all players are ready
    return Utils.Length(this.parentStage.model.clientSubmissions) >= 2;
}