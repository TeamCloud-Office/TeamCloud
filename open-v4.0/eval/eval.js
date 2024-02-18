let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    UP,
    SP,
    CP,
    AP,
    getDate,
    Kakaocord,
    User,
    LS,
    msg,
    Pos,
    chat,
    post,
    random,
    Coin,
    Nickname,
    Like,
    ogimg
} = require("A");

let onf = true;

function onProjectButtonClicked(id) {
    if (id == "on") {
        onf = true;
        Api.showToast('eval : ' + onf, 0);
    }
    if (id == "off") {
        onf = false;
        Api.showToast('eval : ' + onf, 0);
    }
}

function onMessage(event) {
    let cut = event.message.split(" ");

    let test = "본 메시지는 테스트 메시지 입니다!";


    if (event.message.startsWith(prefix + "e")) {
        if (!onf) return event.room.send(msg.noti + "eval 기능이 꺼져있습니다.");
        if (User.read(event.sender.name) == false) return event.room.send(msg.terms);
        if (User.edit(event.sender.name).admin == false) return event.room.send(msg.admin);
        try {
            var before = Date.now();
            event.room.send(msg.noti + eval((event.message).substr(6)));
            java.lang.Thread.sleep(0);
            var after = Date.now();
            event.room.send("RunTime : " + (after - before) + "ms");
        } catch (e) {
            event.room.send(msg.error + JSON.stringify(e));
        }
    }
}