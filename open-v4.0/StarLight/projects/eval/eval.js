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
    Kakaocord,
    User,
    KV,
    msg,
    Pos,
    chat,
    post,
    random,
    randomI,
    Coin,
    Nickname,
    Like,
    ogimg,
    getImageBase64
} = require("A");

let {
    company,
    toFixed,
    open,
    json_reply,
    array_random,
    isOpen,
    get_delay,
    price,
    process,
    path1,
    path2,
    assess,
    get_remain,
    change_m,
    timer
} = require("stock_m")

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

    let getDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        second: new Date().getSeconds(),
        day: new Date().getDay(),
        today: (str) => new Date().getFullYear() + str + (new Date().getMonth() + 1) + str + new Date().getDate(),
        time: (str) => new Date().getHours() + str + new Date().getMinutes() + str + new Date().getSeconds()
    };

    let cut = event.message.split(" ");

    let test = "본 메시지는 테스트 메시지 입니다!";

    let Set = JSON.parse(FS.read(SP))

    let Udata = User.get(event.sender.name)

    if (event.message.startsWith(prefix + "e")) {
        if (!onf) return event.room.send(msg.noti + "eval 기능이 꺼져있습니다.");
        if (Set["set"]["state"] == 1) {
            if (Boolean(Udata) == false) return event.room.send(msg.terms);
            if (Udata["admin"] == false) return event.room.send(msg.admin);
        }
        try {
            var before = Date.now();
            event.room.send(msg.noti + eval((event.message).substr(6)));
            java.lang.Thread.sleep(0);
            var after = Date.now();
            event.room.send("RunTime : " + (after - before) + "ms");
        } catch (e) {
            event.room.send(msg.error(e.name, e.message, e.lineNumber));
        }
    }
}

function onStartCompile() {
    User.open();
}