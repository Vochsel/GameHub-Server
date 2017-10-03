{
    isValidated: function() {
        //Return true if all players are ready
        return Utils.Length(thisStage.model.clientSubmissions) >= 2;
    }
}