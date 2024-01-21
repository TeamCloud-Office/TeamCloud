Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let {
    prefix,
    Lw,
    FS,
    state,
    snd,
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
    ogimg
} = require("A");

function onMessage(event) {
    let cut = event.message.split(" ");

    let id = cut[2];
    let count = Number(cut[3]);

    if (event.message.startsWith(prefix)) {
        try {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));
            switch (cut[1]) {

                case "기록 ":
                    event.room.send(JSON.stringify(JSON.parse(FS.read("sdcard/BotData/chat/" + (cut[2] + "y/") + (cut[3] + "m/") + (cut[4] + "d") + ".json")), null, 4));
                    break;

                case "경고 ":
                    if (count > 0) {
                        event.room.send("경고가 " + count + "회 증감되었습니다.");
                        let a = User.edit(id, true).warning_count += count;
                        User.edit(id, true).warning_count = a;
                        User.save();
                    }
                    if (count < 0) {
                        event.room.send("경고가 " + count + "회 차감되었습니다.");
                        let a = User.edit(id, true).warning_count += count;
                        User.edit(id, true).warning_count = a;
                        User.save();
                    }
                    break;

                case "사용제한 ":
                    if (count == 1) {
                        event.room.send("해당 사용자의 사용제한이 설정되었습니다.");
                        User.edit(id, true).ban == true;
                        User.save();
                    }
                    if (count == 0) {
                        event.room.send("해당 사용자의 사용제한이 해제되었습니다.");
                        User.edit(id, true).ban == false;
                        User.save();
                    }
                    break;

                case "코인 ":
                    event.room.send(Coin(id, cut[3], cut[4], true));
                    break;

                case "닉네임 ":
                    event.room.send(Nickname(id, cut[3], cut[4], true));
                    break;

                case "변경 ":
                    let id1 = cut[2], //old
                        id2 = cut[3]; //new
                    let newName = User.edit(id2, true).name;
                    User.edit(id1, true).name = newName;
                    User.set(id2, JSON.parse(User.edit(id1)));
                    User.delete(id1);
                    break;

                case "정보 ":
                    event.room.send([
                        msg.noti,
                        "이름 : " + User.edit(event.message.replace(prefix + "정보 ", "")).name,
                        "닉네임 : " + User.edit(event.message.replace(prefix + "정보 ", "")).nickname,
                        "관리자 : " + (User.edit(event.message.replace(prefix + "정보 ", "")).admin ? "예" : "아니오"),
                        "팀클 코인 : " + User.edit(event.message.replace(prefix + "정보 ", "")).teamcloud_coin + "코인",
                        "경고 횟수 : " + User.edit(event.message.replace(prefix + "정보 ", "")).warning_count + "회",
                        "주식 보유 종목: " + User.edit(event.message.replace(prefix + "정보 ", "")).stock,
                        "에릭과의 호감도 : " + User.edit(event.message.replace(prefix + "정보 ", "")).like,
                        "기타 : " + User.edit(event.message.replace(prefix + "정보 ", "")).etc
                    ].join("\n"));
                    break;

                case "탈퇴 ":
                    event.room.send('힝.. 슬프지만 어쩔 수 없지..ㅠ');
                    User.delete(event.message.replace(prefix + "탈퇴 ", ""));
                    User.save();
                    break;

                case "공지 ":
                    let rooms = {
                        "Little women": false,
                        "78 마굿간": false,
                        "견디고 듣다보면 늘어가는 비트코인 지식정보 공유방": false,
                        "밀크초코 수다방": false,
                        "다잡방": false,
                        "타장르 잡담방": false
                    };
                    let msg = event.message.replace(prefix + "알리기", "");
                    for (let room in rooms) {
                        if (!rooms[room]) {
                            Api.replyRoom(room, "[TeamCloud 공지]" + msg);
                        }
                    }
                    event.room.send("공지를 모든 방에 전송했어!");
            }
        } catch (e) {
            event.room.send(msg.error + JSON.stringify(e));
        }
    }
}