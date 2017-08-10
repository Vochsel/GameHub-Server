class Message {
    constructor(a_type, a_data) {
        this.type = a_type;
        this.data = a_data;
    }

    stringify() {
        return JSON.stringify(this);
    }

    static parse(a_message) {
        var p = JSON.parse(a_message);
        return new Message(p.type, p.data);
    }

    static emit(a_ws, a_message) {
        //Check if web socket is valid
        if(a_ws != undefined && ws != null){
            //Check if web socket is open
            if(a_ws.readyState === WebSocket.OPEN) {
                //Stringify and send message
                a_ws.send(JSON.stringify(a_message));
            }
        }
    }
}

module.exports = Message;