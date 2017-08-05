class Messager {
    constructor() {

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