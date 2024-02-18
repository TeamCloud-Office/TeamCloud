let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    state,
    getDate,
    c_path,
    Kakaocord,
    msg,
    Pos,
    chat_log,
    random,
    addCode,
    User,
    Coin,
    Nickname,
    Like,
    ogimg
} = require("A");

function onMessage(event) {
    if ((/에릭아 ./.test(event.message))) {
        java.lang.Thread.sleep(1500);
        event.room.send(Like(event.sender.name, "up", Math.floor(random(3))));
    }
} 