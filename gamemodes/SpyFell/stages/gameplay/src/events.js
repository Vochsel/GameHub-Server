exports.isValidated = function () {
    return false;
}

exports.onEnter = function() {
    var clients = GH.System.deviceManager.getAllDevicesOfType("client");
    clients = Utils.Shuffle(clients);

    var resource = this.parentGM.resources.get("locations").data;
    var location = resource[Utils.RandomInt(0, Utils.Length(resource))];
    console.log(location);

    this.model.location = location

    clients[0].setRole("spy", false, false);    

    for(var i = 1; i < Utils.Length(clients); i++) {
        clients[i].data["location_role"] = location.roles[Utils.RandomInt(0, Utils.Length(location.roles))]
        clients[i].setRole("default", false, false);
    }
};
