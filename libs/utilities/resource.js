// -- External Dependencies
const EventEmitter  = require('events');
const fs            = require('fs');

// -- Internal Dependencies
const Utils         = require('./utils.js');
const Debug         = require('./debug.js');

class Resource extends EventEmitter {

    // -- Resource Constructor
    constructor(a_options) {
        //Call EventEmitter constructor
        super();

        //Resource name
        this.name = (a_options && Utils.Valid(a_options.name)) ? a_options.name : "Untitled Resource";

        //Resource UID
        this.uid = (a_options && Utils.Valid(a_options.uid)) ? a_options.uid : null;

        //Resource url (File path)
        this.url = (a_options && Utils.Valid(a_options.url)) ? a_options.url : "No URL given!";

        //Contents of resource
        this.source = "";

        this.loadResource();
    }

    loadResource() {
        //Store ref to this for callback
        var self = this;

        //Read file asynchronously
        fs.readFile(this.url, function read(a_err, a_data) {

            //Error loading file
            if (a_err) {
                //Log out error message
                Debug.Error("[Resource] Error reading file!");
                Debug.Error("[Resource] " + a_err);

                //Emit error event
                self.emit("error", a_err);

                //Throw Error?
                throw a_err;
            }

            //Store file contents
            self.source = a_data;

            //Check if resource is JSON.
            var sourceParsed = JSON.parse(self.source);
            if(sourceParsed) {
                self.source = sourceParsed;
            }
            
            //Emit load event
            self.emit("load", self.source);
        });
    }

}

module.exports = Resource;