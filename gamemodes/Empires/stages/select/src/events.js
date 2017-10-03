{
    enter: function() {
        //Pick random theme for stage
        var themes = GH.System.gm.resources.get('tdata').source;
        var theme = themes[Utils.RandomInt(0, themes.length)].theme;

        GH.System.gm.model.themeChoice = theme;
    }
}