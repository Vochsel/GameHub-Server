
function Message(a_type, a_data) {
    
    this.type = a_type;
    this.data = a_data;

    this.stringify = function() {
        return JSON.stringify(this);
    }

}

Message.parse = function(a_message){
    var p = JSON.parse(a_message);
    return new Message(p.type, p.data);
}