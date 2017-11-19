exports.onEnter = function() {
    var themes = this.parentGM.resources.get('tData').data;
    var themeData = themes[Utils.RandomInt(0, themes.length)];

    var themeName = themeData.theme;    
    this.model.themeName = themeName;

    var subThemes = themeData.options;

    var clients = GH.System.deviceManager.getAllDevicesOfType("client");
    var numOfClients = clients.length;

    for(var i = 0; i < numOfClients; i++) {
        var randOption = subThemes[Utils.RandomInt(0, subThemes.length)]
        clients[i].data.subTheme = randOption;
        //subThemes[clients[i].uid] = randOption;
    }
}

exports.onExit = function() {
    this.parentGM.flow[1].repeats = Utils.Length(this.parentGM.model.submissions);

}