exports.onEnter = function () {
    Utils.StartTimer(() => {
        GH.GMManager.Progress();
    }, 2 * Utils.Length(this.parentStage.parentGM.model.themeSelections));
}
