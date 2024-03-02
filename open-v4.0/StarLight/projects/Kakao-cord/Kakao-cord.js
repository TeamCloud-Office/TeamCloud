let A = Bridge.getScopeOf("A");

function onMessage(event) {

    if (event.message == 'ping') {
        event.room.send('pong(Kakao-cord)');
    }


    if (event.message.startsWith("e.")) {
        try {
            event.room.send(eval(event.message.slice(2)));
        } catch (e) {
            event.room.send(msg.error + JSON.stringify(e));
        }
    }
}