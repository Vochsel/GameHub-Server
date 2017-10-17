exports.onEnter = function () {
    console.log("Entered Stage Select");
    //Pick random theme for stage

    var themes = this.parentGM.resources.get('themeData').data;
    var theme = themes[Utils.RandomInt(0, themes.length)].theme;

    this.parentGM.model.themeChoice = theme;
}
