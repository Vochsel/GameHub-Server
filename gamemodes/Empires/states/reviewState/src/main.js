exports.onEnter = function () {
    Utils.StartTimer(function () {
        GH.System.gm.progressGameMode();
    }, 2 * Utils.Length(GH.System.gm.model.themeSelections));
}
