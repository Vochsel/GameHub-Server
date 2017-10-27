exports.onEnter = function() {
    var themes = this.parentGM.resources.get('tData').data;
    var theme = themes[Utils.RandomInt(0, themes.length)].question;

    var options = theme.options;

    var clients = GH.System.deviceManager.getAllDevicesOfType("client");
    var numOfClients = clients.length;

    for(var i = 0; i < numOfClients; i++) {
        var randOption = options[Utils.RandomInt(0, options.length)]
        subthemes[clients[i].uid] = randOption;
    }
}