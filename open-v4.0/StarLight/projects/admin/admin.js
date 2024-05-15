let {
    prefix,
    Lw,
    Line,
    LM,
    FS,
    UP,
    SP,
    CP,
    AP,
    Kakaocord,
    User,
    LS,
    msg,
    Pos,
    chat,
    post,
    random,
    Coin,
    Nickname,
    CoinA,
    NicknameA,
    Like,
    ogimg
} = require("Basic");

function onMessage(event) {


    let Set = JSON.parse(FS.read(SP))


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


    try {
        let user = event.message.match(/u:([^,]+)/) ? event.message.match(/u:([^,]+)/)[1] : null
        let season = event.message.match(/e:([^,]+)/) ? event.message.match(/e:([^,]+)/)[1] : null
        let warn = event.message.match(/w:([^,]+)/) ? event.message.match(/w:([^,]+)/)[1] : null
        let ban = event.message.match(/b:([^,]+)/) ? event.message.match(/b:([^,]+)/)[1] : null
        let coin = event.message.match(/c:([^,]+)/) ? event.message.match(/c:([^,]+)/)[1] : null
        let nickname = event.message.match(/n:([^,]+)/) ? event.message.match(/n:([^,]+)/)[1] : null
        let pm = event.message.match(/p:([^,]+)/) ? event.message.match(/p:([^,]+)/)[1] : null
        let stars = event.message.match(/s:([^,]+)/) ? event.message.match(/s:([^,]+)/)[1] : null
        let nuser = event.message.match(/nu:([^,]+)/) ? event.message.match(/nu:([^,]+)/)[1] : null
        let message = event.message.match(/m:([^,]+)/) ? event.message.match(/m:([^,]+)/)[1] : null

        let Udata_id = User.get(user)
        let Udata_name = User.get(event.sender.name)


        /*if (event.message.startsWith(prefix + "기록 ")) {
            if (!User.read(event.sender.name)) return event.room.send(msg.noti + msg.terms);
            if (!User.edit(event.sender.name).admin) return event.room.send(msg.noti + msg.admin);
            if (!User.read(id, true)) return event.room.send(["해당 사용자를 찾을 수 없습니다.", "사용자: " + id].join("\n"));

            event.room.send(JSON.stringify(JSON.parse(FS.read("sdcard/BotData/chat/" + (cut[2] + "y/") + (cut[3] + "m/") + (cut[4] + "d") + ".json")), null, 4));
        }*/


        /**
            @param {String} user 사용자 아이디 (또는 사용자 이름)
            @param {String} season 사유
            @param {Number} warn 지급/회수할 경고수
         */
        if (event.message.startsWith(prefix + "경고 ")) {
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            if (user == null || season == null || warn == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
            if (Boolean(Udata_id) == true) return event.room.send([
                error_,
                "해당 사용자를 찾을 수 없습니다.",
                "사용자: " + user
            ].join("\n"));

            Udata_id["warn"] += Number(warn)
            User.put(Udata_id["id"], Udata_id)

            if (warn > 0) {
                post(Udata_id["id"], [
                    "제목: 경고 안내",
                    "사용자: " + "[" + Udata_id["nickname"][0] + "]" + Udata_id["name"],
                    "사유: " + season,
                    Udata_id["warn"] + "회" + "(+" + Math.abs(warn) + "회" + ")"
                ], Udata_name["name"])
            } else {
                post(Udata_id["id"], [
                    "제목: 경고 안내",
                    "사용자: " + "[" + Udata_id["nickname"][0] + "]" + Udata_id["name"],
                    "사유: " + season,
                    Udata_id["warn"] + "회" + "(-" + Math.abs(warb) + "회" + ")"
                ], Udata_name["name"])
            }
        }


        if (event.message.startsWith(prefix + "차단 ")) {
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            if (user == null || season == null || ban == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
            if (Boolean(Udata_id) == true) return event.room.send([
                error_,
                "해당 사용자를 찾을 수 없습니다.",
                "사용자: " + user
            ].join("\n"));

            Udata_id["ban"] = Boolean(ban)
            User.put(Udata_id["id"], Udata_id)

            if (ban == true) {
                post(Udata_id["id"], [
                    "제목: 차단 안내",
                    "사용자: " + "[" + Udata_id["nickname"][0] + "]" + Udata_id["name"],
                    "사유: " + season,
                    "차단: " + ban ? "O" : "X"
                ], Udata_name["name"])
            }
            if (ban == false) {
                post(Udata_id["id"], [
                    "제목: 차단 안내",
                    "사용자: " + "[" + Udata_id["nickname"][0] + "]" + Udata_id["name"],
                    "사유: " + season,
                    "차단: " + ban ? "O" : "X"
                ], Udata_name["name"])
            }
        }


        if (event.message.startsWith(prefix + "코인 ")) {
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            if (user == null || season == null || coin == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
            if (Boolean(Udata_id) == true) return event.room.send([
                error_,
                "해당 사용자를 찾을 수 없습니다.",
                "사용자: " + user
            ].join("\n"));

            event.room.send(Coin(user, season, coin, true, Udata_name["name"]));
            User.put(Udata_id["id"], Udata_id)
        }


        if (event.message.startsWith(prefix + "닉네임 ")) {
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            if (user == null || season == null || nickname == null || pm == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
            if (Boolean(Udata_id) == true) return event.room.send([
                error_,
                "해당 사용자를 찾을 수 없습니다.",
                "사용자: " + user
            ].join("\n"));

            event.room.send(Nickname(user, season, nickname, pm, true, Udata_name["name"]));
            User.put(Udata_id["id"], Udata_id)
        }


        if (event.message.startsWith(prefix + "S")) {
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            if (user == null || stars == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
            if (Boolean(Udata_id) == true) return event.room.send([
                error_,
                "해당 사용자를 찾을 수 없습니다.",
                "사용자: " + user
            ].join("\n"));

            switch (stars) {
                case "1":
                    Udata_id["stars"]["date"] = getDate.today("/");
                    Udata_id["stars"]["ai"] = 30;
                    Udata_id["stars"]["re"] = getDate.month;
                    Udata_id["stars"]["D"] = getDate.date;
                    Udata_id["stars"]["D_date"] = 60;
                    User.put(Udata_id["id"], Udata_id)
                    event.room.send(Coin(Udata["id"], "Stars 가입", 10000, true, "TeamCloud 시스템"));
                    event.room.send(Nickname(Udata["id"], "Stars 가입", "Stars", true, true, Udata_name["name"]))
                    break;
                case "2":
                    Udata_id["stars"]["date"] = getDate.today("/");
                    Udata_id["stars"]["ai"] = 60;
                    Udata_id["stars"]["re"] = getDate.month;
                    Udata_id["stars"]["D"] = getDate.date;
                    Udata_id["stars"]["D_date"] = 120;
                    User.put(Udata_id["id"], Udata_id)
                    event.room.send(Coin(Udata["id"], "Stars 가입", 50000, true, "TeamCloud 시스템"));
                    event.room.send(Nickname(Udata["id"], "Stars 가입", "Light Stars", true, true, Udata_name["name"]))
                    break;
            }
        }


        if (event.message.startsWith(prefix + "변경 ")) {
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            if (user == null || nuser == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
            if (Boolean(Udata_id) == true) return event.room.send([
                error_,
                "해당 사용자를 찾을 수 없습니다.",
                "사용자: " + user
            ].join("\n"));

            if ((Udata_id["change"] > 5) == false) return event.room.send("해당 사용자는 계정 변경을 5번 이상 진행하였습니다.")
            Udata_id["name"] = User.get(nuser)["name"];
            Udata_id["change"]++
            User.put(Udata_id["id"], Udata_id);
            User.delete(nuser);
            post(Udata_id["id"], [
                "제목: " + "계정 변경 안내",
                "사용자: " + "[" + "[" + Udata_id["nickname"][0] + "]" + Udata_id["name"] + "]",
                "위 사용자의 계정 변경이 완료되었습니다."
            ])
            event.room.send("계정 변경이 완료되었습니다.")
        }


        if (event.message.startsWith(prefix + "정보 ")) {
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            if (user == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
            if (Boolean(Udata_id) == true) return event.room.send([
                error_,
                "해당 사용자를 찾을 수 없습니다.",
                "사용자: " + user
            ].join("\n"));

            let stocks;
            if (Object.keys(Udata_id["stocks"]) == "") {
                stocks = "없음";
            } else {
                stocks = Object.keys(Udata_id["stocks"])
            }
            event.room.send([
                msg.noti,
                "이름: " + Udata_id["name"],
                "ID: " + Udata_id["id"],
                "등록 날짜: " + Udata_id["date"],
                "닉네임: " + Udata_id["nickname"],
                "관리자: " + (Udata_id["admin"] ? "예" : "아니오"),
                "팀클 코인: " + Udata_id["coin"] + "코인",
                "경고 횟수: " + Udata_id["warn"] + "회",
                "주식 보유 종목: " + stocks,
                "호감도: " + Udata_id["like"],
                "Stars 가입 날짜: " + Udata_id["stars"]["date"] + "(" + Udata_id["stars"]["D_date"] + "일 남음)",
                "Ai 사용 가능 횟수: " + Udata_id["stars"]["ai"],
                "기타: " + Udata_id["etc"]
            ].join("\n"));
        }


        if (event.message.startsWith(prefix + "탈퇴 ")) {
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            if (user == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
            if (Boolean(Udata_id) == true) return event.room.send([
                error_,
                "해당 사용자를 찾을 수 없습니다.",
                "사용자: " + user
            ].join("\n"));

            event.room.send([
                msg.noti,
                LM("서비스 탈퇴"),
                '해당 사용자와의 연결을 종료했습니다.',
                "사용자명: " + Udata_id["name"]
            ].join("\n"));
            User.delete(id);
        }


        if (event.message.startsWith(prefix + "공지 ")) {
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            let rooms = {
                "Little women": false,
                "78 마굿간": false,
                "견디고 듣다보면 늘어가는 비트코인 지식정보 공유방": false,
                "밀크초코 수다방": false,
                "다잡방": false,
                "타장르 잡담방": false,
                "Heiiza Mr J의 이야기방": false,
                "타장르 소통은 개뿔": false
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
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            if (user == null || message == null) return event.room.send(error_ + "해당 명령어의 필수 값을 작성하지 않았습니다.")
            if (Boolean(Udata_id) == true) return event.room.send([
                error_,
                "해당 사용자를 찾을 수 없습니다.",
                "사용자: " + user
            ].join("\n"));

            post(Udata_id["id"], message, Udata_name["name"]);
        }


        if (event.message.startsWith(prefix + "전체우편 ")) {
            if (Boolean(Udata_name) == false) return event.room.send(msg.noti + msg.terms);
            if (Udata_name["admin"] == false) return event.room.send(msg.noti + msg.admin);

            for (i = 0; i < (User.id()).length; i++) {
                let target = User.id()[i];
                post(target, message, Udata_name["name"]);
            }
        }


    } catch (e) {
        event.room.send(msg.error + JSON.stringify(e));
    }

}