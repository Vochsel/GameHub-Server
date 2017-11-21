exports.onDeviceJoined = function(a_device) {
    var subThemes = this.model.themeData.options;
    var randOption = subThemes[Utils.RandomInt(0, subThemes.length)]
    a_device.data.subTheme = randOption;
    Debug.Warning(randOption);
}