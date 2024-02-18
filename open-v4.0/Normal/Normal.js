
let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    UP,
    SP,
    CP,
    Set,
    getDate,
    User,
    LS,
    msg,
    Pos,
    chat,
    random,
    Coin,
    Nickname,
    ogimg
} = require("A");


let rooms = {};



function onProjectButtonClicked(id) {
    let data = JSON.parse(FS.read(SP))
    let state = data["set"]["state"];
    if (id == "normal") {
        state = 1;
        Api.showToast('정상 모드', 0);
        FS.write(SP, JSON.stringify(data, null, 4))
    }
    if (id == "check") {
        state = 0;
        Api.showToast('점검 모드', 0);
        FS.write(SP, JSON.stringify(data, null, 4))
    }
    if (id == "test") {
        state = 2;
        Api.showToast('테스트 모드', 0);
        FS.write(SP, JSON.stringify(data, null, 4))
    }

    if (id == "reset") {
        for (let room in rooms) {
            if (!rooms[room]) {
                Api.markAsRead(room);
            }
        }
        Api.compile();
    }
}

function onMessage(event) {
    if (!rooms[event.room.name]) {
        rooms[event.room.name] = false;
    } else {
        rooms[event.room.name] = false;
    }

    //테스트
    if (event.message == prefix + "테스트" || event.message.includes("봇상태")) {
        let before = Date.now();
        event.room.send("TEST!");
        let after = Date.now();
        event.room.send("RunTime : " + (after - before) + "ms");

    }

    //읽음처리
    if (event.message == prefix + "읽음") {
        try {
            for (let room in rooms) {
                if (!rooms[room]) {
                    Api.markAsRead(room);
                }
            }
            event.room.send("모든 채팅방을 읽음처리 했습니다.");
        } catch (e) {
            event.room.send(JSON.stringify(e));
        }
    }

    //스크립트 재설정
    if (event.message == prefix + "재설정") {
        try {
            Api.compile();
            event.room.send("모든 스크립트를 재설정했습니다.");
        } catch (e) {
            event.room.send(JSON.stringify(e));
        }
    }
}