let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    UP,
    SP,
    CP,
    getDate,
    User,
    LS,
    msg,
    Pos,
    post,
    chat,
    random,
    Coin,
    Nickname,
    Admin,
    ogimg
} = require("A");

function onMessage(event) {
    let cut = event.message.split(" ");

    let data = JSON.parse(FS.read(SP))

    if (User.read(event.sender.name)) {
        if (!data["snd"][User.edit(event.sender.name).id]) {
            data["snd"][User.edit(event.sender.name).id] = [];
            FS.write(SP, JSON.stringify(data, null, 4));
        }
    }

    let id = cut[2];
    let count = Number(cut[3]);
    try {

        /*if (event.message.startsWith(prefix + "기록 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            event.room.send(JSON.stringify(JSON.parse(FS.read("sdcard/BotData/chat/" + (cut[2] + "y/") + (cut[3] + "m/") + (cut[4] + "d") + ".json")), null, 4));
        }*/

        if (event.message.startsWith(prefix + "경고 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            if (count > 0) {
                event.room.send(User.edit(id, true).name + "님의 경고 횟수가 " + count + "회 증감되었습니다.");
                User.edit(id, true).warn += count;
                User.save();
            }
            if (count < 0) {
                event.room.send(User.edit(id, true).name + "님의 경고 횟수가 " + count + "회 차감되었습니다.");
                let a = User.edit(id, true).warning_count += count;
                User.edit(id, true).warn = a;
                User.save();
            }
        }


        if (event.message.startsWith(prefix + "차단 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            if (count == 1) {
                event.room.send("해당 사용자가 차단되었습니다.");
                User.edit(id, true).ban = true;
                User.save();
            }
            if (count == 0) {
                event.room.send("해당 사용자가 차단해제되었습니다.");
                User.edit(id, true).ban = false;
                User.save();
            }
        }


        if (event.message.startsWith(prefix + "코인 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));
            /**
             * 
             * @param {String} s 사용자
             * @param {String} e 사유
             * @param {Boolean} tf 코인t/닉네임f
             * @param {String} cn 코인/닉네임
             * @param {String} a 관리자 이름
             * @returns 
             */
            event.room.send(Admin(id, cut[3], true, cut[4], event.sender.name));
        }


        if (event.message.startsWith(prefix + "닉네임 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            /**
             * 
             * @param {String} s 사용자
             * @param {String} e 사유
             * @param {Boolean} tf 코인t/닉네임f
             * @param {String} cn 코인/닉네임
             * @param {String} a 관리자 이름
             * @returns 
             */
            event.room.send(Admin(id, cut[3], false, cut[4], event.sender.name));
        }


        if (event.message.startsWith(prefix + "변경 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            let old_id = cut[2], //old
                new_id = cut[3]; //new
            let newName = User.edit(id2, true).name;
            User.edit(old_id, true).name = newName;
            User.set(new_id, JSON.parse(User.edit(id1)));
            User.delete(id1);
        }


        if (event.message.startsWith(prefix + "정보 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            let stocks;
            if (String(JSON.stringify(User.edit(id, true).stocks)) == "{}") {
                stocks = "없음";
            } else {
                stocks = Object.keys(User.edit(id, true).stocks)
            }
            event.room.send([
                msg.noti,
                "이름: " + User.edit(id, true).name,
                "ID: " + User.edit(id, true).id,
                "닉네임: " + User.edit(id, true).nickname,
                "관리자: " + (User.edit(id, true).admin ? "예" : "아니오"),
                "팀클 코인: " + User.edit(id, true).coin + "코인",
                "경고 횟수: " + User.edit(id, true).warn + "회",
                "주식 보유 종목: " + stocks,
                "호감도: " + User.edit(id, true).like,
                "기타: " + User.edit(id, true).etc
            ].join("\n"));
        }


        if (event.message.startsWith(prefix + "탈퇴 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
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
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
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
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            let splitIndex = event.message.replace(prefix + "우편 ", "").indexOf(" * ");
            if (splitIndex !== -1) {
                let target = event.message.replace(prefix + "우편 ", "").slice(0, splitIndex);
                let msgp = event.message.replace(prefix + "우편 ", "").slice(splitIndex + 3); // " * "의 길이: 3

                post(target, msgp, event.sender.name);
                event.room.send(msg.noti + User.edit(target, true).name + '님께 우편을 전송하였습니다.');
            } else {
                event.room.send(msg.error + "올바르지 않은 형식입니다.");
            }
        }


        if (event.message.startsWith(prefix + "전체우편 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            let msgp = event.message.replace(prefix + "우편 ", "");
            for (i = 0; i < Object.keys(LS.getDate()).length; i++) {
                let target = Object.keys(LS.getDate())[i];
                post(target, msgp, event.sender.name);
            }
            event.room.send(msg.noti + '모든 사용자에게 우편을 전송하였습니다.');
        }


        if (User.read(event.sender.name)) {
            if (Object.keys(data["snd"]).includes(User.edit(event.sender.name).id) && data["snd"][User.edit(event.sender.name).id].length >= 1) {
                let items = data["snd"][User.edit(event.sender.name).id];
                let contents = [];

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];

                    contents.push(User.edit(item.sender, true).name + '의 메시지 | ' + item.time +
                        "\n" +
                        '→ ' + item.content +
                        "\n" +
                        '관리자 이름: ' + item.admin);
                }
                event.room.send([
                    msg.noti,
                    LM("우편"),
                    "사용자: " + "[" + User.edit(event.sender.name).nickname[0] + "]" + event.sender.name,
                    '우편 개수: ' + contents.length,
                    Lw,
                    contents.join('\n━━━━━━━━━━━━━━━━━━━━━━━━\n')
                ].join('\n'));

                delete data["snd"][User.edit(event.sender.name).id];
                FS.write(SP, JSON.stringify(data, null, 4));
            }
        }


    } catch (e) {
        event.room.send(msg.error + JSON.stringify(e));
    }

}