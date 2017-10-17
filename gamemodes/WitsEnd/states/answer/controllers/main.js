exports.clientSubmit = function (a_device, a_data) {
    if (Utils.Valid(a_data.clientSubmission)) {
        thisStage.model.clientSubmissions[a_device.uid] = {
            uid: a_device.uid,
            name: a_device.name,
            answer: a_data.clientSubmission
        };

        a_device.role = "default";
        a_device.shouldRefreshView = true;
    }
}