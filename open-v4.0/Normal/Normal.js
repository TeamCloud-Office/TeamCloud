
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



/*function onProjectButtonClicked(id) {
    if (id == "normal") {
        Set.edit("state") = 1;
        Api.showToast('정상 모드', 0);
        Set.save();
    }
    if (id == "check") {
        Set.edit("state") = 0;
        Api.showToast('점검 모드', 0);
        Set.save();
    }
    if (id == "test") {
        Set.edit("state") = 2;
        Api.showToast('테스트 모드', 0);
        Set.save();
    }

    if (id == "reset") {
        for (let room in rooms) {
            if (!rooms[room]) {
                Api.markAsRead(room);
            }
        }
        Api.compile();
    }
}*/

function onMessage(event) {
    if (!rooms[event.room.name]) {
        rooms[event.room.name] = false;
    } else {
        rooms[event.room.name] = false;
    }

    let cmd_list = [
        "도움말",
        "약관",
        "동의",
        "출석",
        "출석순위",
        "내 출석",
        "멜론차트",
        "음악검색",
        "가위바위보",
        "주사위",
        "날씨",
        "홀짝",
        "디데이",
        "내 정보",
        "주식",
    ];

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
            event.room.send(JSON.stringify(e))
        }
    }

    //스크립트 재설정
    if (event.message == prefix + "재설정") {
        try {
            Api.compile();
            event.room.send("모든 스크립트를 재설정했습니다.");
        } catch (e) {
            event.room.send(JSON.stringify(e))
        }
    }
}