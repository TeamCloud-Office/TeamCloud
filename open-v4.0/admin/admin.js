import {
    prefix,
    cut,
    User,
    snd,
    msg,
    chat_log,
    Coin,
    Nickname,
} from "A_module";

function onMessage(event) {

    let id = cut[2];
    let count = Number(cut[3]);

    /*if (event.message.startsWith(prefix + "기록")) {
        if (!User.edit(event.sender.name).admin) event.room.send(msg.noti + msg.admin);
        event.room.send(JSON.stringify(JSON.parse(fs.read("sdcard/BotData/chat/" + (cut[2] + "y/") + (cut[3] + "m/") + (cut[4] + "d") + ".json")), null, 4));
    }*/

    if (event.message.startsWith(prefix)) {
        if (!User.edit(event.sender.name).admin, false) return event.room.send(msg.noti + msg.admin);
        if (!User.read(id)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));
        switch (id) {
            case "경고":
                if (count > 0) {
                    event.room.send("경고가 " + count + "회 증감되었습니다.");
                    let a = User.edit(id, false).warning_count += count;
                    User.edit(id, false).warning_count = a;
                    User.save();
                }
                if (count < 0) {
                    event.room.send("경고가 " + count + "회 차감되었습니다.");
                    let a = User.edit(id, false).warning_count += count;
                    User.edit(id, false).warning_count = a;
                    User.save();
                }
                break;
            case "사용제한":
                if (count == 1) {
                    event.room.send("해당 사용자의 사용제한이 설정되었습니다.");
                    User.edit(id, false).ban == true;
                    User.save();
                }
                if (count == 0) {
                    event.room.send("해당 사용자의 사용제한이 해제되었습니다.");
                    User.edit(id, false).ban == false;
                    User.save();
                }
                break;
            case "코인":
                event.room.send(Coin(id, cut[3], cut[4], true));
                break;
            case "닉네임":
                event.room.send(Nickname(id, cut[3], cut[4], true));
                break;
            case "변경":
                let id1 = cut[2], //old
                    id2 = cut[3]; //new
                let newName = User.edit(id2).name;
                User.edit(id1).name = newName;
                User.set(id2, User.edit(id1));
        }
    }

    if (event.message.startsWith(A.prefix + "절교")) {
        if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
        if (!User.read(event.message.replace(A.prefix + "절교 ", ""))) return event.room.send("그런 친구는 모르는데..");
        event.room.send('힝.. 슬프지만 어쩔 수 없지..ㅠ');
        User.delete(event.message.split(" ")[2]);
        User.save();
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