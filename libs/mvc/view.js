/* Internal Dependencies */
const Utils         = require('../utilities/utils.js');
const Debug         = require('../utilities/debug.js');

class View {
    constructor(a_options) {
        //View type, specifies what device will recieve view
        this.type   = (a_options && Utils.Valid(a_options.type)) ? a_options.type : "default";

        //View role, specifies which subset of devices will recieve view
        this.role   = (a_options && Utils.Valid(a_options.role)) ? a_options.role : "default";

        //View data to provide on execution
        this.data   = (a_options && Utils.Valid(a_options.data)) ? a_options.data : "";

        if(a_options && Utils.Valid(a_options.src)) {
            this.data = this.loadSrc(a_options.src);
        } 
    }

    loadSrc(a_path) {
        
    }
}

module.exports = View;