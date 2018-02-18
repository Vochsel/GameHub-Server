exports.clientSubmit = function (a_device, a_data) {
    //ID of question submitted
    qid = a_data.qid;
    qval = a_data["clientSubmission_" + qid];

    for(var challenger of this.parentState.parentStage.parentGM.model.questions[qid].challengers) {
        if(challenger.device.uid == a_device.uid) {

            Debug.Log("Found challenger, stored answer!");
            Debug.Log(qid + " : " + qval);

            if(isNaN(a_device.data.submitted)) {
                a_device.data.submitted = 0;
            }

            //Fix this you lazy boy
            if(challenger.answer == "blank")
                a_device.data.submitted += 1;

            challenger.answer = qval;

            
            if(a_device.data.submitted >= 2)
                a_device.setRole("ready", true);
                
            console.log(a_device.data.submitted);
            return;
        }
    }

    Debug.Warning("This should not happen. This device is not a compatible challenger for this question...");
};