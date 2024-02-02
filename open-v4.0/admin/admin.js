Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, ProjectManager.project.info.name);
let {
    prefix,
    Lw,
    FS,
    state,
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
    try {

        if (event.message.startsWith(prefix + "기록 ")) {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            event.room.send(JSON.stringify(JSON.parse(FS.read("sdcard/BotData/chat/" + (cut[2] + "y/") + (cut[3] + "m/") + (cut[4] + "d") + ".json")), null, 4));
        }

        if (event.message.startsWith(prefix + "경고 ")) {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

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
        }

        if (event.message.startsWith(prefix + "사용제한 ")) {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            if (count == "1") {
                event.room.send("해당 사용자의 사용제한이 설정되었습니다.");
                User.edit(id, true).ban == true;
                User.save();
            }
            if (count == "0") {
                event.room.send("해당 사용자의 사용제한이 해제되었습니다.");
                User.edit(id, true).ban == false;
                User.save();
            }
        }

        if (event.message.startsWith(prefix + "코인 ")) {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            event.room.send(Coin(id, cut[3], cut[4], true));
        }

        if (event.message.startsWith(prefix + "닉네임 ")) {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            event.room.send(Nickname(id, cut[3], cut[4], true));
        }

        if (event.message.startsWith(prefix + "변경 ")) {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            let id1 = cut[2], //old
                id2 = cut[3]; //new
            let newName = User.edit(id2, true).name;
            User.edit(id1, true).name = newName;
            User.set(id2, JSON.parse(User.edit(id1)));
            User.delete(id1);
        }

        if (event.message.startsWith(prefix + "정보 ")) {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            event.room.send([
                msg.noti,
                "이름 : " + User.edit(cut[2]).name,
                "닉네임 : " + User.edit(cut[2]).nickname,
                "관리자 : " + (User.edit(cut[2]).admin ? "예" : "아니오"),
                "팀클 코인 : " + User.edit(cut[2]).teamcloud_coin + "코인",
                "경고 횟수 : " + User.edit(cut[2]).warning_count + "회",
                "주식 보유 종목: " + User.edit(cut[2]).stocks,
                "에릭과의 호감도 : " + User.edit(cut[2]).like,
                "기타 : " + User.edit(cut[2]).etc
            ].join("\n"));
        }

        if (event.message.startsWith(prefix + "탈퇴 ")) {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            event.room.send([
                msg.noti,
                LM(id),
                '해당 사용자와의 연결을 종료했습니다.',
                "사용자명: " + User.edit(id, true).name
            ].join("\n"));
            User.delete(id);
            User.save();
            Api.reload();
        }

        if (event.message.startsWith(prefix + "공지 ")) {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

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

        if (event.message.startsWith(prefix + "우편 ")) {
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            let target = event.message.replace(prefix + "우편 ", "").split(" ` ")[0];
            let msgp = event.message.replace(prefix + "우편 ", "").split(" ` ")[1];

            if (!snd[target]) snd[target] = [];
            event.room.send(target + '님께 우편을 전송하였습니다.');
            snd[target].push([
                '메시지 : ' + msgp,
                "",
                "",
                '관리자 이름 : ' + event.sender.name
            ].join("\n"));
        }
        let snd_ = JSON.stringify(snd);
        if (snd[event.sender.name]) {
            event.room.send(' [' + event.sender.name + ']님, 아래 우편 확인바랍니다. \n' + '우편 개수 : ' + snd[event.sender.name].length + '' + Lw + '\n\n\n' + snd[event.sender.name].join('\n\n\n\n'));
            delete snd[event.sender.name];
        }

        if (event.message == "post Test") event.room.send(snd_);


    } catch (e) {
        event.room.send(msg.error + JSON.stringify(e));
    }

}