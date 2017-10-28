exports.onEnter = function() {
    var clients = GH.System.deviceManager.getAllDevicesOfType('client');
    this.model.chosenName = clients[Math.floor(Math.random() * clients.length)].name;


    console.log(this.parentGM.resources.get('qdata'));
    var questions = this.parentGM.resources.get('qdata').data;
    var question = questions[Utils.RandomInt(0, questions.length)].question;

    this.model.question = question;

    //Reset device roles 
    GH.System.deviceManager.getAllDevicesOfType("client").forEach(function(device) {
        device.reset();
    }, this);
}