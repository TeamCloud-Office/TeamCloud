let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    UP,
    SP,
    CP,
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
    if (id == "normal") {
        data["set"]["state"] = 1;
        Api.showToast('정상 모드', 0);
        Api.makeNoti("현재 상태", "정상 모드");
        FS.write(SP, JSON.stringify(data, null, 4))
        Api.replyRoom("TeamCloud 팀원", "정상모드로 변경되었습니다.")
    }
    if (id == "check") {
        data["set"]["state"] = 0;
        Api.showToast('점검 모드', 0);
        Api.makeNoti("현재 상태", "점검 모드");
        FS.write(SP, JSON.stringify(data, null, 4))
        Api.replyRoom("TeamCloud 팀원", "점검모드로 변경되었습니다.")
    }
    if (id == "test") {
        data["set"]["state"] = 2;
        Api.showToast('테스트 모드', 0);
        Api.makeNoti("현재 상태", "테스트 모드");
        FS.write(SP, JSON.stringify(data, null, 4))
        Api.replyRoom("TeamCloud 팀원", "테스트모드로 변경되었습니다.")
    }

    if (id == "reset") {
        Api.showToast('전체 리로드 시작', 0);
        Api.makeNoti("현재 상태", "리로드 시작");
        for (let room in rooms) {
            if (!rooms[room]) {
                Api.markAsRead(room);
            }
        }
        Api.compile();
        Api.showToast('전체 리로드 성공', 0);
        Api.makeNoti("현재 상태", "리로드 완료");
        Api.replyRoom("TeamCloud 팀원", "리로드가 완료되었습니다.")
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