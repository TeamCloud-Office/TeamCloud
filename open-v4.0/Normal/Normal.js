let {
    prefix,
    Lw,
    FS,
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
} = require("A");


let rooms = {};



function onProjectButtonClicked(id) {
    if (id == "normal") {
        state = 1;
        Api.showToast('정상 모드', 0);
    }
    if (id == "check") {
        state = 0;
        Api.showToast('점검 모드', 0);
    }
    if (id == "test") {
        state = 2;
        Api.showToast('테스트 모드', 0);
    }

    if (id == "reset"){
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
    if (event.message == "!테스트" || event.message.includes("봇상태")) {
        let before = Date.now();
        event.room.send("TEST!");
        let after = Date.now();
        event.room.send("RunTime : " + (after - before) + "ms");

    }

    //읽음처리
    if (event.message == "!읽음") {
        try {
            for (let room in rooms) {
                if (!rooms[room]) {
                    Api.markAsRead(room);
                }
            }
            event.room.send("모든 방을 읽음처리 했어!");
        } catch (e) {
            event.room.send("에러가 발생했어!\n오류 내용 : " + e.message)
        }
    }
    if (event.message) {
        let count;
        count++;
        if (count >= 100) {
            for (let room in rooms) {
                if (!rooms[room]) {
                    Api.markAsRead(room);
                }
            }
            count = 0;
        }
    }

    //스크립트 재설정
    if (event.message == "!재설정") {
        try {
            Api.compile();
            event.room.send("모든 스크립트를 재설정했어!");
        } catch (e) {
            event.room.send("에러가 발생했어!\n오류 내용 : " + e.message)
        }
    }
}