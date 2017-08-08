const Express = require('express');
const WebSocketServer = require('ws').Server;

var GH = require('../gamehub.js');

//const GH = require('../gamehub.js');

const Debug = require('../debug.js');

class ServerManager {
    constructor() {
        //Server Config
        this.PORT = 3000;

        /* ---------- Express ---------- */

        //Create express application
        this.application = Express();

        //Serve public folder
        this.application.use(Express.static('public'));

        //Create Express Server
        var self = this;
        this.webServer = this.application.listen(this.PORT, function() {
            Debug.Log("[GH Web Server] Server running on port: " + self.PORT, "yellow");
            self = null;
        });

        /* --------- WS Server --------- */

        this.socketServer = new GHSocketServer({ server : this.webServer, deviceManager: this.deviceManager });
        
    }

}

// -- Dedicated GameHub Web Socket Server
class GHSocketServer extends WebSocketServer {
    constructor(a_options, a_cb) {

        //Call WebSocketServer super
        super(a_options, a_cb);
        // -- Assign Event Callbacks
        
        //WSS has started listening
        this.on('listening', function() {
            Debug.Log("[GH Socket Server] Server listening", "yellow");
            
        });

        //On Socket Error
        this.on("error", function(a_err) {
            Debug.Log("[GH Socket Server] Server error", "yellow");
            Debug.Log(a_err, "yellow");
        })

        //Client has connected
        this.on('connection', function(a_socket) {
            Debug.Log("[GH Socket Server] New connection", "yellow");

            //Connection IP - Remote Address
            const connIP = a_socket._socket.remoteAddress;
            
            //Add device
            GH.deviceManager.addDevice(connIP, connIP, a_socket);
        });

    }
}

module.exports = ServerManager;