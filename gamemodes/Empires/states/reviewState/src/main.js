exports.onEnter = function () {
    Utils.StartTimer(() => {
        this.parentStage.parentGM.progressGameMode();
    }, 2 * Utils.Length(this.parentStage.parentGM.model.themeSelections));
}
