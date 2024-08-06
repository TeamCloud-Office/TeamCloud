let A = Bridge.getScopeOf("A");

function onMessage(event) {
    let name = (msg) => event.message.replace(A.prefix + msg + " ", "").split(" ` ")[0];
    let count = (msg) => Number(event.message.replace(A.prefix + msg + " ", "").split(" ` ")[1]);

    if (event.message.startsWith(A.prefix + "경고")) {
        if (!A.user.edit(event.sender.name).admin) event.room.send(A.msg.noti + '우리 가족이 아냐!');
        if (!A.user.read(name("경고"))) return event.room.send("그런 친구는 모르는데..(" + name("경고") + ")");
        if (count("경고") > 0) {
            event.room.send("경고를 " + count("경고") + "회 추가할게!");
            let a = A.user.edit(name("경고"), false).warning_count += count("경고");
            A.user.edit(name("경고"), false).warning_count = a;
            A.user.save();
        }
        if (count("경고") < 0) {
            event.room.send("경고를 " + count("경고") + "회 제거할게!");
            let a = A.user.edit(name("경고"), false).warning_count += count("경고");
            A.user.edit(name("경고"), false).warning_count = a;
            A.user.save();
        }
    }

    if (event.message.startsWith(A.prefix + "밴")) {
        if (!A.user.edit(event.sender.name).admin) event.room.send(A.msg.noti + '우리 가족이 아냐!');
        if (!A.user.read(name("밴"))) return event.room.send("그런 친구는 모르는데..(" + name("밴") + ")");
        if (count("밴") == "true") {
            event.room.send("ban true");
            A.user.edit(name("밴")).ban == true;
            A.user.save();
        }
        if (count == "false") {
            event.room.send("ban false");
            A.user.edit(name("밴")).ban == false;
            A.user.save();
        }
    }

    if (event.message.startsWith(A.prefix + "절교")) {
        if (!A.user.edit(event.sender.name).admin) event.room.send(A.msg.noti + '우리 가족이 아냐!');
        if (!A.user.read(event.message.replace(A.prefix + "절교 ", ""))) return event.room.send("그런 친구는 모르는데..");
        event.room.send('힝.. 슬프지만 어쩔 수 없지..ㅠ');
        A.user.delete(event.message.split(" ")[2]);
        A.user.save();
        return;
    }

    let rooms = {
        "Little women": false,
        "78 마굿간": false,
        "견디고 듣다보면 늘어가는 비트코인 지식정보 공유방": false,
        "밀크초코 수다방": false,
        "다잡방": false,
        "타장르 잡담방": false
    }

    if (event.message.startsWith(A.prefix + "알리기")) {
        if (!A.user.edit(event.sender.name).admin) event.room.send(A.msg.noti + '우리 가족이 아냐!');
        let msg = event.message.replace(A.prefix + "알리기", "");
        try {
            for (let room in rooms) {
                if (!rooms[room]) {
                    Api.replyRoom(room, "[TeamCloud 공지]" + msg);
                }
            }
        } catch (e) {
            event.room.send(e);
        }
        event.room.send("공지를 모든 방에 전송했어!");
    }
}