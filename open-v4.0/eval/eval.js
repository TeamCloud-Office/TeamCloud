import {
    prefix,
    Lw,
    fs,
    cut,
    getDate,
    Kakaocord,
    User,
    msg,
    Pos,
    chat_log,
    random,
    Coin,
    Nickname,
    ogimg,
    c_path,
} from "A";

let onf = "on";

function onProjectButtonClicked(id) {
    if (id == "on") {
        onf = "on";
        Api.makeNoti('eval', onf);
        Api.showToast('eval 기능 : ' + onf, 0);
    }
    if (id == "off") {
        onf = "off";
        Api.makeNoti('eval', onf);
        Api.showToast('eval 기능 : ' + onf, 0);
    }
}

function onMessage(event) {

    let test = "본 메시지는 테스트 메시지 입니다!";


    if (event.message.startsWith(prefix + "e")) {
        if (onf == "on") {
            if (!User.read(event.sender.name)) event.room.send("나한테 명령하지마!");
            if (User.edit(event.sender.name, false).admin) {
                try {
                    var before = Date.now();
                    event.room.send(msg.noti + eval((event.message).substr(5)) + "\n\n[" + Env.runtimeName + " " + Env.runtimeVersion + "]에서 실행됨");
                    java.lang.Thread.sleep(0);
                    var after = Date.now();
                    event.room.send("RunTime : " + (after - before) + "ms");
                } catch (e) {
                    event.room.send("[" + e.name + "]\n" + e.message + "\n" + "line : #" + e.lineNumber);
                }
            } else {
                event.room.send("나한테 명령하지마!");
            }
        } else if (onf == "off") {
            event.room.send("eval 기능이 꺼져있어!");
        }
    }
}