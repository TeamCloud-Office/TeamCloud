let A = Bridge.getScopeOf("A");

function onMessage(event) {
    
    if (event.message == 'ping') {
        event.room.send('pong(Kakao-cord)');
    }

    
    if (event.message.startsWith("e.")) {
        try {
            event.room.send(eval(event.message.slice(2)));
        }catch(e) {
            event.room.send(
                "["+e.name+"]\n"
                +e.message+"\n"
                +"line : #"+e.lineNumber
            );
        }
    }
}